-- Per-session player counting. The browser mints a random UUID when a player
-- opens a game and reuses it for retries within that sitting; it is anonymous
-- (random, no personal data, and nothing links two separate sittings).

create table shy_private.shy_game_sessions (
  game_id text not null references shy_private.shy_game_totals (game_id),
  session_id uuid not null,
  completions integer not null default 0 check (completions >= 0),
  primary key (game_id, session_id)
);
revoke all on table shy_private.shy_game_sessions from public, anon, authenticated;

drop function public.record_game_start(text);
create function public.record_game_start(p_game_id text, p_session_id uuid default null)
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

  -- One start per session id: reopening the game mints a new id, retrying does not.
  if p_session_id is null then
    update shy_private.shy_game_totals set start_count = start_count + 1 where game_id = p_game_id;
  else
    insert into shy_private.shy_game_sessions (game_id, session_id)
    values (p_game_id, p_session_id)
    on conflict do nothing;
    if found then
      update shy_private.shy_game_totals set start_count = start_count + 1 where game_id = p_game_id;
    end if;
  end if;
  return jsonb_build_object('recorded', true);
end;
$$;

drop function public.submit_game_run(text, jsonb, text[], text[]);
create function public.submit_game_run(
  p_game_id text,
  p_answers jsonb,
  p_skipped_question_ids text[],
  p_retried_question_ids text[] default '{}',
  p_session_id uuid default null
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

  -- Count responses per session so a retry reads as another response from the same player.
  if p_session_id is not null then
    insert into shy_private.shy_game_sessions as s (game_id, session_id, completions)
    values (p_game_id, p_session_id, 1)
    on conflict (game_id, session_id) do update set completions = s.completions + 1;
  end if;

  return jsonb_build_object('recorded', true);
end;
$$;

create or replace function public.admin_game_stats()
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
      'unique_players', (select count(*)::int from shy_private.shy_game_sessions gs where gs.game_id = t.game_id),
      'repeat_responses', (select coalesce(sum(gs.completions - 1), 0)::int
        from shy_private.shy_game_sessions gs where gs.game_id = t.game_id and gs.completions > 0),
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
              on c.game_id = o.game_id and c.question_id = q.question_id and c.answer_option_id = o.answer_option_id
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

-- Dropped and recreated functions lose their grants; lock them down again.
revoke all on function public.record_game_start(text, uuid) from public, anon, authenticated;
revoke all on function public.submit_game_run(text, jsonb, text[], text[], uuid) from public, anon, authenticated;
grant execute on function public.record_game_start(text, uuid) to anon, authenticated;
grant execute on function public.submit_game_run(text, jsonb, text[], text[], uuid) to anon, authenticated;
