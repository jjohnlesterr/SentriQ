-- NOT YET APPLIED to the live project (bkilgkrizpxphfmwkvgb).
-- Additive only: creates a teacher profile for every NEW auth user.
-- Existing users/profiles are untouched. `on conflict do nothing` ensures
-- this trigger can never cause a sign-up to fail.
--
-- Why: the live database has no trigger on auth.users, and profiles has no
-- INSERT policy, so accounts created through the app never get a profile row.
-- They can still log in (the proxy treats a missing profile as "teacher"),
-- but they are invisible to the admin Users page and cannot be promoted.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, lower(new.email), 'teacher')
  on conflict do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Rollback:
--   drop trigger if exists on_auth_user_created on auth.users;
--   drop function if exists public.handle_new_user();
