create table shy_private.booth_players (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique,
  name text not null check (length(btrim(name)) between 1 and 120),
  email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  created_at timestamptz not null default now()
);

create table shy_private.booth_runs (
  id uuid primary key,
  player_id uuid not null references shy_private.booth_players(id),
  game_id text not null references shy_private.shy_game_totals(game_id),
  completed_at timestamptz not null default now(),
  answers jsonb not null,
  score integer not null,
  question_count integer not null,
  skipped integer not null
);

alter table shy_private.booth_players enable row level security;
alter table shy_private.booth_runs enable row level security;
revoke all on shy_private.booth_players, shy_private.booth_runs from public, anon, authenticated;
create index booth_runs_player on shy_private.booth_runs(player_id);
create index booth_runs_completed on shy_private.booth_runs(completed_at, id);

create function public.register_booth_player(p_token uuid, p_name text, p_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if p_token is null or p_name is null or p_email is null
    or length(btrim(p_name)) not between 1 and 120 or length(btrim(p_email)) > 254
    or btrim(p_email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid name and email address' using errcode = '22023';
  end if;
  if not shy_private.take_rate_slot('booth:register', 300) then
    raise exception 'Please try again shortly';
  end if;
  insert into shy_private.booth_players(token, name, email)
  values (p_token, btrim(p_name), lower(btrim(p_email))) on conflict (token) do nothing;
  if not exists (select 1 from shy_private.booth_players where token = p_token
    and name = btrim(p_name) and email = lower(btrim(p_email))) then
    raise exception 'Registration could not be saved';
  end if;
  return jsonb_build_object('recorded', true);
end;
$$;

create function public.record_booth_start(p_token uuid, p_game_id text)
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

create function public.submit_booth_run(
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

create function public.admin_booth_results(p_offset integer default 0, p_limit integer default 100)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not shy_private.is_admin() then raise exception 'Not authorized' using errcode = '42501'; end if;
  if p_offset < 0 or p_limit not between 1 and 500 then raise exception 'Invalid page'; end if;
  return (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
    select g.id, p.name, p.email, g.game_id, g.completed_at, g.score, g.question_count, g.skipped, g.answers
    from shy_private.booth_runs g join shy_private.booth_players p on p.id = g.player_id
    order by g.completed_at, g.id offset p_offset limit p_limit
  ) r);
end;
$$;

revoke all on function public.register_booth_player(uuid,text,text) from public, anon, authenticated;
revoke all on function public.submit_booth_run(uuid,uuid,text,jsonb,text[],text[]) from public, anon, authenticated;
revoke all on function public.admin_booth_results(integer,integer) from public, anon, authenticated;
grant execute on function public.register_booth_player(uuid,text,text) to anon;
grant execute on function public.submit_booth_run(uuid,uuid,text,jsonb,text[],text[]) to anon;
grant execute on function public.admin_booth_results(integer,integer) to authenticated;
