create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users on delete cascade,
  name text not null,
  code text not null,
  tier text not null check (tier in ('standard','premium')),
  executions int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_scripts_owner on public.scripts(owner);
