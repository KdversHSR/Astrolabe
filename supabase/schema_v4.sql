-- À exécuter UNE fois dans Supabase (SQL Editor > New query > Run), après schema.sql, schema_v2.sql et schema_v3.sql.
-- Ajoute : administrateurs, retours/bugs, gestion des signalements, statistiques anonymes, équipes enregistrées.

-- 1) Administrateurs --------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
drop policy if exists "admins : moi" on public.admins;
create policy "admins : moi" on public.admins for select using (auth.uid() = user_id);

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- 2) Signalements de profils : l'administrateur peut lire, traiter, supprimer --
alter table public.reports add column if not exists status text not null default 'open';
drop policy if exists "signalement : admin lecture" on public.reports;
drop policy if exists "signalement : admin modification" on public.reports;
drop policy if exists "signalement : admin suppression" on public.reports;
create policy "signalement : admin lecture" on public.reports for select using (public.is_admin());
create policy "signalement : admin modification" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "signalement : admin suppression" on public.reports for delete using (public.is_admin());

-- L'administrateur peut voir tous les profils et en masquer un (is_public = false)
drop policy if exists "profil : admin lecture" on public.profiles;
drop policy if exists "profil : admin modification" on public.profiles;
create policy "profil : admin lecture" on public.profiles for select using (public.is_admin());
create policy "profil : admin modification" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- 3) Retours des visiteurs (bugs, données fausses, idées) ----------------------
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid(),
  kind text not null default 'bug' check (kind in ('bug', 'data', 'idea', 'other', 'auto')),
  message text not null check (char_length(message) between 3 and 1000),
  page text check (char_length(page) <= 200),
  agent text check (char_length(agent) <= 200),
  status text not null default 'open',
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
drop policy if exists "retour : ajout" on public.feedback;
drop policy if exists "retour : admin lecture" on public.feedback;
drop policy if exists "retour : admin modification" on public.feedback;
drop policy if exists "retour : admin suppression" on public.feedback;
create policy "retour : ajout" on public.feedback for insert with check (user_id is null or user_id = auth.uid());
create policy "retour : admin lecture" on public.feedback for select using (public.is_admin());
create policy "retour : admin modification" on public.feedback for update using (public.is_admin()) with check (public.is_admin());
create policy "retour : admin suppression" on public.feedback for delete using (public.is_admin());

-- 4) Équipes enregistrées -----------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  members jsonb not null check (jsonb_typeof(members) = 'array' and jsonb_array_length(members) between 1 and 4 and octet_length(members::text) <= 600),
  created_at timestamptz not null default now()
);
alter table public.teams enable row level security;
drop policy if exists "équipes : lecture" on public.teams;
drop policy if exists "équipes : ajout" on public.teams;
drop policy if exists "équipes : modification" on public.teams;
drop policy if exists "équipes : suppression" on public.teams;
create policy "équipes : lecture" on public.teams for select using (auth.uid() = user_id);
create policy "équipes : ajout" on public.teams for insert with check (auth.uid() = user_id);
create policy "équipes : modification" on public.teams for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "équipes : suppression" on public.teams for delete using (auth.uid() = user_id);

-- 5) Statistiques anonymes du site (aucun identifiant n'est renvoyé) -------------
create or replace function public.site_stats() returns json
language sql security definer stable set search_path = public as
$$
  select json_build_object(
    'players', (select count(distinct user_id) from public.collection),
    'own', coalesce((select json_object_agg(char_id, json_build_object('n', n, 'e', e))
                     from (select char_id, count(*) n, round(avg(eidolon)::numeric, 2) e from public.collection group by char_id) t), '{}'::json),
    'favc', coalesce((select json_object_agg(item_id, n) from (select item_id, count(*) n from public.favorites where kind = 'char' group by item_id) t), '{}'::json),
    'favb', coalesce((select json_object_agg(item_id, n) from (select item_id, count(*) n from public.favorites where kind = 'build' group by item_id) t), '{}'::json),
    'teams', coalesce((select json_agg(json_build_object('m', m, 'n', n) order by n desc)
                       from (select (select jsonb_agg(x->>'c' order by x->>'c') from jsonb_array_elements(members) x) m, count(*) n
                             from public.teams group by 1 order by count(*) desc limit 10) t), '[]'::json)
  )
$$;
grant execute on function public.site_stats() to anon, authenticated;

-- 6) VOUS : devenir administrateur ---------------------------------------------
-- Remplacez l'adresse ci-dessous par celle de votre compte sur le site, puis lancez cette ligne :
-- insert into public.admins (user_id) select id from auth.users where email = 'VOTRE-ADRESSE@exemple.com' on conflict do nothing;
