create table if not exists public.whitelist (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.scripts on delete cascade,
  discord_id text not null,
  roblox_id text not null,
  expires_at timestamptz,
  created_at timestamptz default now(),
  unique(script_id, discord_id, roblox_id)
);
create index idx_whitelist_script on public.whitelist(script_id);
