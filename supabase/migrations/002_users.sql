-- Club Vanilla — Users table migration
-- Run this in the Supabase SQL editor after 001 (schema.sql).

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table users enable row level security;

create trigger users_updated_at
  before update on users
  for each row execute function set_updated_at(); -- reuses existing function from schema.sql
