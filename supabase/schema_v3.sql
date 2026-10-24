-- À exécuter UNE fois dans Supabase (SQL Editor > New query > Run), après schema.sql et schema_v2.sql.
alter table public.profiles add column if not exists handle text unique check (handle ~ '^[a-z0-9_-]{3,20}$');
alter table public.profiles add column if not exists bio text check (char_length(bio) <= 200);
alter table public.profiles add column if not exists is_public boolean not null default false;
alter table public.profiles add column if not exists showcase jsonb not null default '[]'::jsonb
  check (jsonb_typeof(showcase) = 'array' and jsonb_array_length(showcase) <= 6 and octet_length(showcase::text) <= 4000);
alter table public.profiles add column if not exists stats jsonb not null default '{}'::jsonb check (octet_length(stats::text) <= 500);
alter table public.profiles add constraint profiles_name_len check (char_length(display_name) <= 24);
create policy "profil : public" on public.profiles for select using (is_public = true);

create table if not exists public.profile_likes (
  profile_id uuid not null references public.profiles(user_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, user_id)
);
alter table public.profile_likes enable row level security;
create policy "likes : lecture" on public.profile_likes for select using (true);
create policy "likes : ajout" on public.profile_likes for insert with check (auth.uid() = user_id and user_id <> profile_id);
create policy "likes : suppression" on public.profile_likes for delete using (auth.uid() = user_id);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  profile_id uuid not null,
  reporter uuid not null default auth.uid(),
  reason text not null check (char_length(reason) <= 300),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "signalement : ajout" on public.reports for insert with check (auth.uid() = reporter);
-- aucune politique de lecture : consultez les signalements dans Table Editor > reports.
