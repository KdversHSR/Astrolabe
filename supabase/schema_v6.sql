-- Gachadex : vitrine de cartes visible sur le profil public (à exécuter une fois dans Supabase → SQL Editor → Run)
alter table public.profiles add column if not exists cards jsonb not null default '{}'::jsonb
  check (jsonb_typeof(cards) = 'object' and octet_length(cards::text) <= 1500);
