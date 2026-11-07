create table public.shy_game_questions (
  game_id text not null,
  question_id text not null,
  primary key (game_id, question_id)
);

create table public.shy_game_answer_options (
  game_id text not null,
  question_id text not null,
  answer_option_id text not null,
  primary key (game_id, question_id, answer_option_id),
  foreign key (game_id, question_id)
    references public.shy_game_questions (game_id, question_id)
);

create table public.shy_game_answer_counts (
  game_id text not null,
  question_id text not null,
  answer_option_id text not null,
  selection_count bigint not null default 0 check (selection_count >= 0),
  primary key (game_id, question_id, answer_option_id),
  foreign key (game_id, question_id, answer_option_id)
    references public.shy_game_answer_options (game_id, question_id, answer_option_id)
);

create table public.shy_game_skip_counts (
  game_id text not null,
  question_id text not null,
  skip_count bigint not null default 0 check (skip_count >= 0),
  primary key (game_id, question_id),
  foreign key (game_id, question_id)
    references public.shy_game_questions (game_id, question_id)
);

create table public.shy_game_totals (
  game_id text primary key,
  completion_count bigint not null default 0 check (completion_count >= 0),
  answered_count bigint not null default 0 check (answered_count >= 0),
  skipped_count bigint not null default 0 check (skipped_count >= 0)
);

-- Anonymous five-minute buckets provide a project-wide abuse ceiling and
-- aggregate monitoring without storing participant identifiers.
create table public.shy_game_submission_buckets (
  game_id text not null,
  bucket_start timestamptz not null,
  accepted_count bigint not null default 0 check (accepted_count >= 0),
  primary key (game_id, bucket_start)
);

alter table public.shy_game_questions enable row level security;
alter table public.shy_game_answer_options enable row level security;
alter table public.shy_game_answer_counts enable row level security;
alter table public.shy_game_skip_counts enable row level security;
alter table public.shy_game_totals enable row level security;
alter table public.shy_game_submission_buckets enable row level security;

revoke all on table
  public.shy_game_questions,
  public.shy_game_answer_options,
  public.shy_game_answer_counts,
  public.shy_game_skip_counts,
  public.shy_game_totals,
  public.shy_game_submission_buckets
from anon, authenticated;

insert into public.shy_game_questions (game_id, question_id)
values
  ('pov-friend-texted-you-this', 'q1'),
  ('pov-friend-texted-you-this', 'q2'),
  ('pov-friend-texted-you-this', 'q3'),
  ('pov-friend-texted-you-this', 'q4'),
  ('pov-friend-texted-you-this', 'q5'),
  ('pov-friend-texted-you-this', 'q6'),
  ('pov-friend-texted-you-this', 'q7'),
  ('pov-friend-texted-you-this', 'q8'),
  ('pov-friend-texted-you-this', 'q9'),
  ('pov-friend-texted-you-this', 'q10');

insert into public.shy_game_answer_options (game_id, question_id, answer_option_id)
select 'pov-friend-texted-you-this', question_id, answer_option_id
from (values
  ('q1', 'q1-a'), ('q1', 'q1-b'), ('q1', 'q1-c'),
  ('q2', 'q2-a'), ('q2', 'q2-b'), ('q2', 'q2-c'),
  ('q3', 'q3-a'), ('q3', 'q3-b'), ('q3', 'q3-c'),
  ('q4', 'q4-a'), ('q4', 'q4-b'), ('q4', 'q4-c'),
  ('q5', 'q5-a'), ('q5', 'q5-b'), ('q5', 'q5-c'),
  ('q6', 'q6-a'), ('q6', 'q6-b'), ('q6', 'q6-c'),
  ('q7', 'q7-a'), ('q7', 'q7-b'), ('q7', 'q7-c'),
  ('q8', 'q8-a'), ('q8', 'q8-b'), ('q8', 'q8-c'),
  ('q9', 'q9-a'), ('q9', 'q9-b'), ('q9', 'q9-c'),
  ('q10', 'q10-a'), ('q10', 'q10-b'), ('q10', 'q10-c')
) as option_ids(question_id, answer_option_id);

insert into public.shy_game_answer_counts (game_id, question_id, answer_option_id)
select game_id, question_id, answer_option_id
from public.shy_game_answer_options
where game_id = 'pov-friend-texted-you-this';

insert into public.shy_game_skip_counts (game_id, question_id)
select 'pov-friend-texted-you-this', question_id
from public.shy_game_questions
where game_id = 'pov-friend-texted-you-this';

insert into public.shy_game_totals (game_id)
values ('pov-friend-texted-you-this');

create or replace function public.record_game_completion(
  p_game_id text,
  p_answers jsonb,
  p_skipped_question_ids text[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expected_question_count integer;
  submitted_question_count integer;
  answered_question_count integer;
  skipped_question_count integer;
  current_bucket timestamptz;
  current_submission_count bigint;
begin
  select count(*)::integer
  into expected_question_count
  from public.shy_game_questions
  where game_id = p_game_id;

  if expected_question_count = 0 then
    raise exception 'Unknown game';
  end if;

  current_bucket := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / 300) * 300
  );

  insert into public.shy_game_submission_buckets (game_id, bucket_start)
  values (p_game_id, current_bucket)
  on conflict (game_id, bucket_start) do nothing;

  select accepted_count
  into current_submission_count
  from public.shy_game_submission_buckets
  where game_id = p_game_id and bucket_start = current_bucket
  for update;

  -- This is deliberately a shared safety ceiling: per-participant limits
  -- would require collecting an identifier, which this project forbids.
  if current_submission_count >= 500 then
    return jsonb_build_object('recorded', false, 'reason', 'rate_limited');
  end if;

  if jsonb_typeof(p_answers) <> 'array' or p_skipped_question_ids is null then
    raise exception 'Invalid completion payload';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_answers) as submitted(question_id text, option_id text)
    left join public.shy_game_answer_options valid
      on valid.game_id = p_game_id
      and valid.question_id = submitted.question_id
      and valid.answer_option_id = submitted.option_id
    where valid.question_id is null
  ) then
    raise exception 'Invalid question or answer option';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_answers) as submitted(question_id text, option_id text)
    group by submitted.question_id
    having count(*) <> 1
  ) then
    raise exception 'Duplicate answer question';
  end if;

  if exists (
    select 1
    from unnest(p_skipped_question_ids) as skipped(question_id)
    left join public.shy_game_questions valid
      on valid.game_id = p_game_id and valid.question_id = skipped.question_id
    where valid.question_id is null
  ) then
    raise exception 'Invalid skipped question';
  end if;

  if (
    select count(*)
    from unnest(p_skipped_question_ids) as skipped(question_id)
  ) <> (
    select count(distinct question_id)
    from unnest(p_skipped_question_ids) as skipped(question_id)
  ) then
    raise exception 'Duplicate skipped question';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_answers) as submitted(question_id text, option_id text)
    join unnest(p_skipped_question_ids) as skipped(question_id)
      on skipped.question_id = submitted.question_id
  ) then
    raise exception 'Question cannot be answered and skipped';
  end if;

  select count(*)::integer into answered_question_count
  from jsonb_to_recordset(p_answers) as submitted(question_id text, option_id text);

  select count(*)::integer into skipped_question_count
  from unnest(p_skipped_question_ids) as skipped(question_id);

  submitted_question_count := answered_question_count + skipped_question_count;
  if submitted_question_count <> expected_question_count then
    raise exception 'Completion must account for every question';
  end if;

  update public.shy_game_totals
  set completion_count = completion_count + 1,
      answered_count = answered_count + answered_question_count,
      skipped_count = skipped_count + skipped_question_count
  where game_id = p_game_id;

  update public.shy_game_submission_buckets
  set accepted_count = accepted_count + 1
  where game_id = p_game_id and bucket_start = current_bucket;

  insert into public.shy_game_answer_counts (game_id, question_id, answer_option_id, selection_count)
  select p_game_id, submitted.question_id, submitted.option_id, 1
  from jsonb_to_recordset(p_answers) as submitted(question_id text, option_id text)
  on conflict (game_id, question_id, answer_option_id)
  do update set selection_count = public.shy_game_answer_counts.selection_count + 1;

  insert into public.shy_game_skip_counts (game_id, question_id, skip_count)
  select p_game_id, skipped.question_id, 1
  from unnest(p_skipped_question_ids) as skipped(question_id)
  on conflict (game_id, question_id)
  do update set skip_count = public.shy_game_skip_counts.skip_count + 1;

  return jsonb_build_object('recorded', true);
end;
$$;

revoke all on function public.record_game_completion(text, jsonb, text[]) from public;
grant execute on function public.record_game_completion(text, jsonb, text[]) to anon, authenticated;
