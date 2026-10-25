-- Astrolabe v15 : marché et échanges de cartes Hoyo Cards
-- À coller UNE FOIS dans Supabase > SQL Editor > New query > Run.
-- Principe : le joueur qui met une carte en vente la "met de côté" (retirée de son jeu côté navigateur).
-- Le serveur garantit seulement qu'une offre ne peut être prise qu'UNE fois et récupérée qu'UNE fois.

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  seller uuid not null references auth.users(id) on delete cascade,
  seller_name text,
  card text not null check (char_length(card) between 1 and 60),
  fin int not null default 0 check (fin between 0 and 3),
  kind text not null check (kind in ('coins','card')),
  price int check (price between 1 and 5000),
  want text check (char_length(want) <= 60),
  want_fin int not null default 0 check (want_fin between 0 and 3),
  status text not null default 'open' check (status in ('open','done','cancelled')),
  buyer uuid references auth.users(id) on delete set null,
  claimed boolean not null default false,
  buyer_claimed boolean not null default false,
  created_at timestamptz not null default now(),
  check ((kind = 'coins' and price is not null) or (kind = 'card' and want is not null))
);
create index if not exists trades_status_idx on public.trades (status, created_at desc);
alter table public.trades enable row level security;

-- lecture : les offres ouvertes + mes propres échanges. Aucune écriture directe : tout passe par les fonctions ci-dessous.
drop policy if exists trades_read on public.trades;
create policy trades_read on public.trades for select to authenticated
  using (status = 'open' or seller = auth.uid() or buyer = auth.uid());

create or replace function public.trade_create(p_card text, p_fin int, p_kind text, p_price int, p_want text, p_want_fin int, p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare n int; nid uuid;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  select count(*) into n from trades where seller = auth.uid() and status = 'open';
  if n >= 5 then raise exception 'limit'; end if;
  insert into trades (seller, seller_name, card, fin, kind, price, want, want_fin)
  values (auth.uid(), left(coalesce(p_name,''), 24), p_card, p_fin, p_kind, p_price, p_want, coalesce(p_want_fin,0))
  returning id into nid;
  return nid;
end $$;

create or replace function public.trade_accept(tid uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare k int;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  update trades set status = 'done', buyer = auth.uid()
   where id = tid and status = 'open' and seller <> auth.uid();
  get diagnostics k = row_count;
  if k = 0 then raise exception 'gone'; end if;
  return true;
end $$;

create or replace function public.trade_cancel(tid uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare k int;
begin
  update trades set status = 'cancelled' where id = tid and seller = auth.uid() and status = 'open';
  get diagnostics k = row_count;
  if k = 0 then raise exception 'gone'; end if;
  return true;
end $$;

-- le vendeur récupère le gain (éclats ou carte voulue) ou sa carte si l'offre est retirée : une seule fois
create or replace function public.trade_claim(tid uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare k int;
begin
  update trades set claimed = true where id = tid and seller = auth.uid() and status in ('done','cancelled') and not claimed;
  get diagnostics k = row_count;
  return k > 0;
end $$;

-- l'acheteur récupère la carte achetée : une seule fois
create or replace function public.trade_claim_buyer(tid uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare k int;
begin
  update trades set buyer_claimed = true where id = tid and buyer = auth.uid() and status = 'done' and not buyer_claimed;
  get diagnostics k = row_count;
  return k > 0;
end $$;

grant execute on function public.trade_create(text,int,text,int,text,int,text) to authenticated;
grant execute on function public.trade_accept(uuid) to authenticated;
grant execute on function public.trade_cancel(uuid) to authenticated;
grant execute on function public.trade_claim(uuid) to authenticated;
grant execute on function public.trade_claim_buyer(uuid) to authenticated;
revoke all on function public.trade_create(text,int,text,int,text,int,text) from anon, public;
revoke all on function public.trade_accept(uuid) from anon, public;
revoke all on function public.trade_cancel(uuid) from anon, public;
revoke all on function public.trade_claim(uuid) from anon, public;
revoke all on function public.trade_claim_buyer(uuid) from anon, public;
