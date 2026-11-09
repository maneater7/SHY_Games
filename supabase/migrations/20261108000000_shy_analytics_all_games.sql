-- Anonymous aggregate analytics for all four SHY games, plus an admin-only read path.
--
-- Privacy rules this schema enforces:
--   * No per-player rows, identifiers, IP addresses, devices or per-play timestamps.
--   * Players can only increment counters through validated RPCs.
--   * Counter tables live in a private schema that the Data API never exposes.
--   * Reading results requires a signed-in, allow-listed admin.

create schema if not exists shy_private;
revoke all on schema shy_private from public;

alter table public.shy_game_questions set schema shy_private;
alter table public.shy_game_answer_options set schema shy_private;
alter table public.shy_game_answer_counts set schema shy_private;
alter table public.shy_game_skip_counts set schema shy_private;
alter table public.shy_game_totals set schema shy_private;

drop function if exists public.record_game_completion(text, jsonb, text[]);
drop table if exists public.shy_game_submission_buckets;

alter table shy_private.shy_game_answer_options
  add column is_best boolean not null default false;

alter table shy_private.shy_game_totals
  add column start_count bigint not null default 0 check (start_count >= 0);

create table shy_private.shy_game_retry_counts (
  game_id text not null,
  question_id text not null,
  retry_count bigint not null default 0 check (retry_count >= 0),
  primary key (game_id, question_id),
  foreign key (game_id, question_id) references shy_private.shy_game_questions (game_id, question_id)
);

create table shy_private.shy_game_exit_counts (
  game_id text not null,
  question_id text not null,
  exit_count bigint not null default 0 check (exit_count >= 0),
  primary key (game_id, question_id),
  foreign key (game_id, question_id) references shy_private.shy_game_questions (game_id, question_id)
);

-- Shared five-minute ceilings. Per-player limits would need an identifier, which this project forbids.
create table shy_private.shy_rate_buckets (
  scope text not null,
  bucket_start timestamptz not null,
  accepted_count bigint not null default 0 check (accepted_count >= 0),
  primary key (scope, bucket_start)
);

create table shy_private.shy_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  added_at timestamptz not null default now()
);

alter table shy_private.shy_game_retry_counts enable row level security;
alter table shy_private.shy_game_exit_counts enable row level security;
alter table shy_private.shy_rate_buckets enable row level security;
alter table shy_private.shy_admins enable row level security;

revoke all on all tables in schema shy_private from public, anon, authenticated;

-- Catalog: every game, question and answer option the RPCs will accept.

update shy_private.shy_game_answer_options
set is_best = true
where game_id = 'pov-friend-texted-you-this'
  and answer_option_id in ('q1-c', 'q2-a', 'q3-b', 'q4-c', 'q5-a', 'q6-b', 'q7-c', 'q8-a', 'q9-b', 'q10-c');

create function shy_private.seed_question(p_game_id text, p_question_id text, p_options text[], p_best text)
returns void
language sql
as $$
  insert into shy_private.shy_game_questions (game_id, question_id) values (p_game_id, p_question_id);
  insert into shy_private.shy_game_answer_options (game_id, question_id, answer_option_id, is_best)
  select p_game_id, p_question_id, option_id, option_id = p_best from unnest(p_options) as option_id;
$$;

insert into shy_private.shy_game_totals (game_id)
values ('myth-or-fact'), ('red-or-green-flag'), ('what-would-you-do');

select shy_private.seed_question('myth-or-fact', question_id, array['myth', 'fact'], best)
from (values
  ('q1', 'fact'), ('q2', 'myth'), ('q3', 'myth'), ('q4', 'fact'), ('q5', 'myth'), ('q6', 'myth'),
  ('q7', 'fact'), ('q8', 'myth'), ('q9', 'fact'), ('q10', 'myth'), ('q11', 'fact'), ('q12', 'fact')
) as catalog(question_id, best);

select shy_private.seed_question('red-or-green-flag', question_id, array['green', 'yellow', 'red'], best)
from (values
  ('s1', 'green'), ('s2', 'red'), ('s3', 'yellow'), ('s4', 'red'), ('s5', 'green'),
  ('s6', 'yellow'), ('s7', 'red'), ('s8', 'green'), ('s9', 'red'), ('s10', 'yellow')
) as catalog(question_id, best);

select shy_private.seed_question(
  'what-would-you-do',
  question_id,
  array[question_id || '-a', question_id || '-b', question_id || '-c'],
  question_id || '-' || best
)
from (values
  ('s1', 'c'), ('s2', 'a'), ('s3', 'b'), ('s4', 'c'), ('s5', 'a'),
  ('s6', 'b'), ('s7', 'c'), ('s8', 'a'), ('s9', 'b'), ('s10', 'c')
) as catalog(question_id, best);

drop function shy_private.seed_question(text, text, text[], text);

-- Internal helpers (not callable through the API).

create function shy_private.take_rate_slot(p_scope text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_bucket timestamptz := to_timestamp(floor(extract(epoch from clock_timestamp()) / 300) * 300);
  accepted bigint;
begin
  delete from shy_private.shy_rate_buckets
  where scope = p_scope and bucket_start < current_bucket - interval '1 day';

  insert into shy_private.shy_rate_buckets as bucket (scope, bucket_start, accepted_count)
  values (p_scope, current_bucket, 1)
  on conflict (scope, bucket_start) do update
    set accepted_count = bucket.accepted_count + 1
    where bucket.accepted_count < p_limit
  returning accepted_count into accepted;

  return accepted is not null;
end;
$$;

create function shy_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from shy_private.shy_admins where user_id = auth.uid());
$$;

-- Lets the admin UI reject non-allow-listed accounts before asking for an MFA code.
create function public.admin_check()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from shy_private.shy_admins where user_id = auth.uid());
$$;

-- Public write API (anon key).

create function public.record_game_start(p_game_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from shy_private.shy_game_totals where game_id = p_game_id) then
    raise exception 'Unknown game' using errcode = '22023';
  end if;

  if not shy_private.take_rate_slot(p_game_id || ':start', 1000) then
    return jsonb_build_object('recorded', false, 'reason', 'rate_limited');
  end if;

  update shy_private.shy_game_totals set start_count = start_count + 1 where game_id = p_game_id;
  return jsonb_build_object('recorded', true);
end;
$$;

create function public.submit_game_run(
  p_game_id text,
  p_answers jsonb,
  p_skipped_question_ids text[],
  p_retried_question_ids text[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_expected integer;
  v_question_ids text[];
  v_option_ids text[];
  v_answered integer;
  v_skipped integer;
begin
  select count(*)::integer into v_expected
  from shy_private.shy_game_questions where game_id = p_game_id;

  if v_expected = 0 then
    raise exception 'Unknown game' using errcode = '22023';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'array'
    or p_skipped_question_ids is null or p_retried_question_ids is null
    or jsonb_array_length(p_answers) > v_expected
    or cardinality(p_skipped_question_ids) > v_expected
    or cardinality(p_retried_question_ids) > v_expected
    or exists (select 1 from jsonb_array_elements(p_answers) as item where jsonb_typeof(item) <> 'object')
  then
    raise exception 'Invalid run payload' using errcode = '22023';
  end if;

  select coalesce(array_agg(item ->> 'question_id' order by ord), '{}'),
         coalesce(array_agg(item ->> 'option_id' order by ord), '{}')
  into v_question_ids, v_option_ids
  from jsonb_array_elements(p_answers) with ordinality as e(item, ord);

  if exists (
    select 1 from unnest(v_question_ids, v_option_ids) as s(question_id, option_id)
    left join shy_private.shy_game_answer_options valid
      on valid.game_id = p_game_id and valid.question_id = s.question_id and valid.answer_option_id = s.option_id
    where valid.answer_option_id is null
  ) then
    raise exception 'Invalid question or answer option' using errcode = '22023';
  end if;

  if cardinality(v_question_ids) <> (select count(distinct id) from unnest(v_question_ids) as id)
    or cardinality(p_skipped_question_ids) <> (select count(distinct id) from unnest(p_skipped_question_ids) as id)
    or cardinality(p_retried_question_ids) <> (select count(distinct id) from unnest(p_retried_question_ids) as id)
  then
    raise exception 'Duplicate question in run' using errcode = '22023';
  end if;

  if exists (
    select 1 from unnest(p_skipped_question_ids) as id
    left join shy_private.shy_game_questions valid on valid.game_id = p_game_id and valid.question_id = id
    where valid.question_id is null or id = any (v_question_ids)
  ) then
    raise exception 'Invalid skipped question' using errcode = '22023';
  end if;

  if exists (
    select 1 from unnest(p_retried_question_ids) as id
    where id is null or not (id = any (v_question_ids))
  ) then
    raise exception 'Retries must be answered questions' using errcode = '22023';
  end if;

  v_answered := cardinality(v_question_ids);
  v_skipped := cardinality(p_skipped_question_ids);

  if v_answered + v_skipped <> v_expected then
    raise exception 'Run must account for every question' using errcode = '22023';
  end if;

  if not shy_private.take_rate_slot(p_game_id || ':submit', 500) then
    return jsonb_build_object('recorded', false, 'reason', 'rate_limited');
  end if;

  update shy_private.shy_game_totals
  set completion_count = completion_count + 1,
      answered_count = answered_count + v_answered,
      skipped_count = skipped_count + v_skipped
  where game_id = p_game_id;

  insert into shy_private.shy_game_answer_counts as c (game_id, question_id, answer_option_id, selection_count)
  select p_game_id, s.question_id, s.option_id, 1 from unnest(v_question_ids, v_option_ids) as s(question_id, option_id)
  on conflict (game_id, question_id, answer_option_id) do update set selection_count = c.selection_count + 1;

  insert into shy_private.shy_game_skip_counts as c (game_id, question_id, skip_count)
  select p_game_id, id, 1 from unnest(p_skipped_question_ids) as id
  on conflict (game_id, question_id) do update set skip_count = c.skip_count + 1;

  insert into shy_private.shy_game_retry_counts as c (game_id, question_id, retry_count)
  select p_game_id, id, 1 from unnest(p_retried_question_ids) as id
  on conflict (game_id, question_id) do update set retry_count = c.retry_count + 1;

  return jsonb_build_object('recorded', true);
end;
$$;

create function public.record_game_exit(p_game_id text, p_question_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from shy_private.shy_game_questions where game_id = p_game_id and question_id = p_question_id
  ) then
    raise exception 'Unknown game or question' using errcode = '22023';
  end if;

  if not shy_private.take_rate_slot(p_game_id || ':exit', 1000) then
    return jsonb_build_object('recorded', false, 'reason', 'rate_limited');
  end if;

  insert into shy_private.shy_game_exit_counts as c (game_id, question_id, exit_count)
  values (p_game_id, p_question_id, 1)
  on conflict (game_id, question_id) do update set exit_count = c.exit_count + 1;

  return jsonb_build_object('recorded', true);
end;
$$;

-- Admin read API (authenticated + allow-listed + MFA).

create function public.admin_game_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not shy_private.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'game_id', t.game_id,
      'starts', t.start_count,
      'completions', t.completion_count,
      'answered', t.answered_count,
      'skipped', t.skipped_count,
      'question_detail_available', t.completion_count >= 10,
      'questions', case when t.completion_count >= 10 then (
        select coalesce(jsonb_agg(jsonb_build_object(
          'question_id', q.question_id,
          'skips', coalesce(s.skip_count, 0),
          'retries', coalesce(r.retry_count, 0),
          'exits', coalesce(e.exit_count, 0),
          'options', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'option_id', o.answer_option_id,
              'is_best', o.is_best,
              'count', coalesce(c.selection_count, 0)
            ) order by o.answer_option_id), '[]'::jsonb)
            from shy_private.shy_game_answer_options o
            left join shy_private.shy_game_answer_counts c
              on c.game_id = o.game_id and c.question_id = o.question_id and c.answer_option_id = o.answer_option_id
            where o.game_id = q.game_id and o.question_id = q.question_id
          )
        ) order by length(q.question_id), q.question_id), '[]'::jsonb)
        from shy_private.shy_game_questions q
        left join shy_private.shy_game_skip_counts s on s.game_id = q.game_id and s.question_id = q.question_id
        left join shy_private.shy_game_retry_counts r on r.game_id = q.game_id and r.question_id = q.question_id
        left join shy_private.shy_game_exit_counts e on e.game_id = q.game_id and e.question_id = q.question_id
        where q.game_id = t.game_id
      ) else '[]'::jsonb end
    ) order by t.game_id), '[]'::jsonb)
    from shy_private.shy_game_totals t
  );
end;
$$;

-- Supabase grants EXECUTE on new public functions to anon/authenticated by default; lock each one down explicitly.
revoke all on function shy_private.take_rate_slot(text, integer) from public, anon, authenticated;
revoke all on function shy_private.is_admin() from public, anon, authenticated;
revoke all on function public.record_game_start(text) from public, anon, authenticated;
revoke all on function public.submit_game_run(text, jsonb, text[], text[]) from public, anon, authenticated;
revoke all on function public.record_game_exit(text, text) from public, anon, authenticated;
revoke all on function public.admin_game_stats() from public, anon, authenticated;
revoke all on function public.admin_check() from public, anon, authenticated;

grant execute on function public.record_game_start(text) to anon, authenticated;
grant execute on function public.submit_game_run(text, jsonb, text[], text[]) to anon, authenticated;
grant execute on function public.record_game_exit(text, text) to anon, authenticated;
grant execute on function public.admin_game_stats() to authenticated;
grant execute on function public.admin_check() to authenticated;
