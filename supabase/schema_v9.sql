-- Astrolabe v17 : réseau social (publications, commentaires, amis, chat). À coller UNE FOIS dans Supabase > SQL Editor > Run.
-- (Le compteur « en ligne » n'a besoin d'aucun SQL.)

-- ===== publications =====
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author uuid not null references auth.users(id) on delete cascade,
  author_name text, author_handle text,
  kind text not null default 'other' check (kind in ('image','build','guide','bug','question','other')),
  game text not null default 'hsr' check (game in ('hsr','gi','zzz','hi3','tot','site')),
  title text not null check (char_length(title) between 3 and 80),
  body text not null default '' check (char_length(body) <= 1500),
  image text check (image is null or (image like 'data:image/jpeg;base64,%' and length(image) < 230000)),
  created_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author uuid not null references auth.users(id) on delete cascade,
  author_name text, author_handle text,
  body text not null check (char_length(body) between 1 and 400),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.post_comments (post_id, created_at);
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (post_id, user_id)
);
create table if not exists public.content_reports (
  id bigint generated always as identity primary key,
  reporter uuid not null default auth.uid(),
  kind text not null, target text not null,
  reason text not null check (char_length(reason) <= 300),
  created_at timestamptz not null default now()
);

-- ===== amis et chat =====
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  a uuid not null references auth.users(id) on delete cascade, a_name text, a_handle text,
  b uuid not null references auth.users(id) on delete cascade, b_name text, b_handle text,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  check (a <> b)
);
create unique index if not exists friendships_pair on public.friendships (least(a,b), greatest(a,b));
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  sender uuid not null references auth.users(id) on delete cascade, sender_name text,
  recipient uuid references auth.users(id) on delete cascade,   -- null = salon général
  body text not null check (char_length(body) between 1 and 400),
  created_at timestamptz not null default now()
);
create index if not exists messages_idx on public.messages (recipient, created_at desc);

alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.content_reports enable row level security;
alter table public.friendships enable row level security;
alter table public.messages enable row level security;

drop policy if exists posts_read on public.posts;            create policy posts_read on public.posts for select to authenticated using (true);
drop policy if exists posts_admin_del on public.posts;       create policy posts_admin_del on public.posts for delete to authenticated using (author = auth.uid() or public.is_admin());
drop policy if exists comments_read on public.post_comments; create policy comments_read on public.post_comments for select to authenticated using (true);
drop policy if exists comments_del on public.post_comments;  create policy comments_del on public.post_comments for delete to authenticated using (author = auth.uid() or public.is_admin());
drop policy if exists likes_read on public.post_likes;       create policy likes_read on public.post_likes for select to authenticated using (true);
drop policy if exists reports_add on public.content_reports; create policy reports_add on public.content_reports for insert to authenticated with check (reporter = auth.uid());
drop policy if exists reports_admin on public.content_reports; create policy reports_admin on public.content_reports for select to authenticated using (public.is_admin());
drop policy if exists reports_admin_del on public.content_reports; create policy reports_admin_del on public.content_reports for delete to authenticated using (public.is_admin());
drop policy if exists friends_read on public.friendships;    create policy friends_read on public.friendships for select to authenticated using (a = auth.uid() or b = auth.uid());
drop policy if exists messages_read on public.messages;      create policy messages_read on public.messages for select to authenticated using (recipient is null or sender = auth.uid() or recipient = auth.uid());
drop policy if exists messages_admin_del on public.messages; create policy messages_admin_del on public.messages for delete to authenticated using (public.is_admin());

-- nom affiché (jamais l'e-mail)
create or replace function public._who(uid uuid, out nm text, out hd text) language plpgsql security definer set search_path = public as $$
begin
  select left(coalesce(display_name, handle, 'Joueur'), 24), handle into nm, hd from public.profiles where user_id = uid;
  if not found then nm := 'Joueur'; hd := null; end if;
end $$;

create or replace function public.post_create(p_kind text, p_game text, p_title text, p_body text, p_image text)
returns uuid language plpgsql security definer set search_path = public as $$
declare w record; nid uuid;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if (select count(*) from posts where author = auth.uid() and created_at > now() - interval '1 day') >= 5 then raise exception 'limit'; end if;
  select * into w from public._who(auth.uid());
  insert into posts (author, author_name, author_handle, kind, game, title, body, image)
  values (auth.uid(), w.nm, w.hd, p_kind, p_game, trim(p_title), coalesce(p_body,''), nullif(p_image,'')) returning id into nid;
  return nid;
end $$;

create or replace function public.comment_create(p_post uuid, p_body text)
returns uuid language plpgsql security definer set search_path = public as $$
declare w record; nid uuid;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if (select count(*) from post_comments where author = auth.uid() and created_at > now() - interval '1 hour') >= 20 then raise exception 'limit'; end if;
  select * into w from public._who(auth.uid());
  insert into post_comments (post_id, author, author_name, author_handle, body) values (p_post, auth.uid(), w.nm, w.hd, trim(p_body)) returning id into nid;
  return nid;
end $$;

create or replace function public.post_like(p_post uuid) returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if exists (select 1 from post_likes where post_id = p_post and user_id = auth.uid()) then
    delete from post_likes where post_id = p_post and user_id = auth.uid(); return false;
  end if;
  insert into post_likes values (p_post, auth.uid()); return true;
end $$;

create or replace function public.friend_request(p_handle text) returns text language plpgsql security definer set search_path = public as $$
declare t uuid; w record; x record;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  select user_id into t from profiles where handle = lower(trim(p_handle));
  if t is null then raise exception 'unknown'; end if;
  if t = auth.uid() then raise exception 'self'; end if;
  if (select count(*) from friendships where (a = auth.uid() or b = auth.uid())) >= 100 then raise exception 'limit'; end if;
  select * into x from friendships where least(a,b) = least(auth.uid(),t) and greatest(a,b) = greatest(auth.uid(),t);
  if found then
    if x.status = 'pending' and x.b = auth.uid() then update friendships set status = 'accepted' where id = x.id; return 'accepted'; end if;
    return x.status;
  end if;
  select * into w from public._who(auth.uid());
  insert into friendships (a, a_name, a_handle, b, b_name, b_handle)
    select auth.uid(), w.nm, w.hd, t, (public._who(t)).nm, (public._who(t)).hd;
  return 'pending';
end $$;

create or replace function public.friend_respond(p_id uuid, p_accept boolean) returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_accept then update friendships set status = 'accepted' where id = p_id and b = auth.uid() and status = 'pending';
  else delete from friendships where id = p_id and (a = auth.uid() or b = auth.uid()); end if;
  return true;
end $$;

create or replace function public.send_message(p_to uuid, p_body text) returns bigint language plpgsql security definer set search_path = public as $$
declare w record; nid bigint;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if p_to is not null and not exists (select 1 from friendships where status = 'accepted' and ((a = auth.uid() and b = p_to) or (b = auth.uid() and a = p_to))) then raise exception 'notfriend'; end if;
  if exists (select 1 from messages where sender = auth.uid() and created_at > now() - interval '1500 milliseconds') then raise exception 'slow'; end if;
  select * into w from public._who(auth.uid());
  insert into messages (sender, sender_name, recipient, body) values (auth.uid(), w.nm, p_to, trim(p_body)) returning id into nid;
  return nid;
end $$;

grant execute on function public.post_create(text,text,text,text,text), public.comment_create(uuid,text), public.post_like(uuid), public.friend_request(text), public.friend_respond(uuid,boolean), public.send_message(uuid,text) to authenticated;
revoke all on function public.post_create(text,text,text,text,text), public.comment_create(uuid,text), public.post_like(uuid), public.friend_request(text), public.friend_respond(uuid,boolean), public.send_message(uuid,text) from anon, public;
revoke all on function public._who(uuid) from anon, authenticated, public;
