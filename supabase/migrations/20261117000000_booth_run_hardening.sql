-- Per-player start rate limit + honest duplicate-run responses.
-- Replaces the versions created in 20261116000000_individual_booth_results.sql.
-- Function signatures are unchanged, so existing grants carry over.

create or replace function public.record_booth_start(p_token uuid, p_game_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare player uuid;
begin
  select id into player from shy_private.booth_players where token = p_token;
  if player is null then raise exception 'Register before playing'; end if;
  -- A player may replay, but not flood starts: a handful per game per window.
  if not shy_private.take_rate_slot('booth:start:' || p_game_id || ':' || player, 6) then
    return jsonb_build_object('recorded', false, 'reason', 'rate_limited');
  end if;
  return public.record_game_start(p_game_id, player);
end;
$$;
revoke all on function public.record_booth_start(uuid,text) from public, anon, authenticated;
grant execute on function public.record_booth_start(uuid,text) to anon;

create or replace function public.submit_booth_run(
  p_token uuid, p_run_id uuid, p_game_id text, p_answers jsonb,
  p_skipped_question_ids text[], p_retried_question_ids text[] default '{}'
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  player uuid;
  result jsonb;
  details jsonb;
  correct integer;
  total integer;
begin
  select id into player from shy_private.booth_players where token = p_token for update;
  if player is null or p_run_id is null then raise exception 'Register before playing'; end if;
  if exists (select 1 from shy_private.booth_runs where id = p_run_id) then
    if not exists (select 1 from shy_private.booth_runs where id = p_run_id and player_id = player and game_id = p_game_id) then
      raise exception 'Invalid attempt';
    end if;
    -- Resubmission of an already-stored run: report it as a duplicate so callers
    -- know the payload was not re-processed (and re-scored) on this call.
    return jsonb_build_object('recorded', true, 'duplicate', true);
  end if;
  result := public.submit_game_run(p_game_id, p_answers, p_skipped_question_ids, p_retried_question_ids, player);
  if result->>'recorded' <> 'true' then return result; end if;
  select jsonb_agg(jsonb_build_object(
    'question_id', q.question_id, 'option_id', a.item->>'option_id',
    'correct_option_id', best.answer_option_id,
    'is_correct', coalesce(o.is_best, false),
    'skipped', q.question_id = any(p_skipped_question_ids),
    'retried', q.question_id = any(p_retried_question_ids)
  ) order by q.question_id), count(*) filter (where o.is_best)::int, count(*)::int
  into details, correct, total
  from shy_private.shy_game_questions q
  left join lateral (select item from jsonb_array_elements(p_answers) item where item->>'question_id' = q.question_id) a on true
  left join shy_private.shy_game_answer_options o on o.game_id = q.game_id and o.question_id = q.question_id and o.answer_option_id = a.item->>'option_id'
  left join shy_private.shy_game_answer_options best on best.game_id = q.game_id and best.question_id = q.question_id and best.is_best
  where q.game_id = p_game_id;
  insert into shy_private.booth_runs(id, player_id, game_id, answers, score, question_count, skipped)
  values (p_run_id, player, p_game_id, details, correct, total, cardinality(p_skipped_question_ids));
  return jsonb_build_object('recorded', true);
end;
$$;
revoke all on function public.submit_booth_run(uuid,uuid,text,jsonb,text[],text[]) from public, anon, authenticated;
grant execute on function public.submit_booth_run(uuid,uuid,text,jsonb,text[],text[]) to anon;
