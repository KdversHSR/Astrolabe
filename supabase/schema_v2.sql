-- À exécuter UNE fois dans Supabase (SQL Editor > New query > Run), en plus de schema.sql déjà exécuté.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar text,
  updated_at timestamptz not null default now()
);
create table if not exists public.collection (
  user_id uuid not null references auth.users(id) on delete cascade,
  char_id text not null,
  eidolon int not null default 0 check (eidolon between 0 and 6),
  primary key (user_id, char_id)
);
alter table public.profiles enable row level security;
alter table public.collection enable row level security;
create policy "profil : lecture" on public.profiles for select using (auth.uid() = user_id);
create policy "profil : ajout" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profil : modification" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "collection : lecture" on public.collection for select using (auth.uid() = user_id);
create policy "collection : ajout" on public.collection for insert with check (auth.uid() = user_id);
create policy "collection : modification" on public.collection for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "collection : suppression" on public.collection for delete using (auth.uid() = user_id);
