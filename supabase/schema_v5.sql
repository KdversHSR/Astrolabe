-- À exécuter UNE fois dans Supabase (SQL Editor > New query > Run), après schema.sql, v2, v3 et v4.
-- Ajoute : suppression de son propre compte, suppression de profils/comptes par l'administrateur.

-- 1) Chacun peut supprimer son propre profil public (en plus de le modifier)
drop policy if exists "profil : suppression" on public.profiles;
create policy "profil : suppression" on public.profiles for delete using (auth.uid() = user_id);

-- 2) Suppression complète de MON compte (profil, favoris, collection, équipes, J'aime...) --
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as
$$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = auth.uid();   -- les tables liées se vident en cascade
end
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- 3) Administrateur : supprimer un profil / un compte entier (spam)
drop policy if exists "profil : admin suppression" on public.profiles;
create policy "profil : admin suppression" on public.profiles for delete using (public.is_admin());

create or replace function public.admin_delete_user(target uuid) returns void
language plpgsql security definer set search_path = public, auth as
$$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if target = auth.uid() then raise exception 'cannot delete yourself here'; end if;
  if exists (select 1 from public.admins where user_id = target) then raise exception 'target is an admin'; end if;
  delete from auth.users where id = target;
end
$$;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- 4) L'administrateur qui a activé la double authentification doit l'avoir validée (niveau aal2) pour agir
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public, auth as
$$ select exists (select 1 from public.admins where user_id = auth.uid())
   and (coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
        or not exists (select 1 from auth.mfa_factors where user_id = auth.uid() and status = 'verified')) $$;

-- 5) VOUS : devenir administrateur (remplacez par l'e-mail de votre compte SUR LE SITE), puis Run :
-- insert into public.admins (user_id) select id from auth.users where email = 'VOTRE-ADRESSE@exemple.com' on conflict do nothing;
