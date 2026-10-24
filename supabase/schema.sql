-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('char','build')),
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);
alter table public.favorites enable row level security;
create policy "lecture de ses favoris" on public.favorites for select using (auth.uid() = user_id);
create policy "ajout de ses favoris" on public.favorites for insert with check (auth.uid() = user_id);
create policy "modification de ses favoris" on public.favorites for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "suppression de ses favoris" on public.favorites for delete using (auth.uid() = user_id);
