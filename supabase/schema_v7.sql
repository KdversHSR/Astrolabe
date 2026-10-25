-- Photo de profil importée (à exécuter une fois dans Supabase → SQL Editor → Run)
-- JPEG 160 px encodé en base64 (~8 Ko), taille et format verrouillés côté base.
alter table public.profiles add column if not exists photo text
  check (photo is null or (octet_length(photo) <= 30000 and photo like 'data:image/jpeg;base64,%'));
