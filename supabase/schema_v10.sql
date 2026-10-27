-- Astrolabe v18 : sauvegarde des cartes Gachadex dans le compte (même collection sur téléphone et PC).
-- À coller UNE FOIS dans Supabase > SQL Editor > Run.
create table if not exists public.card_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null check (octet_length(data::text) < 300000),
  score int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.card_saves enable row level security;
drop policy if exists cs_read on public.card_saves;   create policy cs_read   on public.card_saves for select to authenticated using (user_id = auth.uid());
drop policy if exists cs_insert on public.card_saves; create policy cs_insert on public.card_saves for insert to authenticated with check (user_id = auth.uid());
drop policy if exists cs_update on public.card_saves; create policy cs_update on public.card_saves for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
