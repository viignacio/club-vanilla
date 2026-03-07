-- Club Vanilla — Ordering System Schema
-- Run this in the Supabase SQL editor to set up the database.

-- ─── Tables ────────────────────────────────────────────────────────────────────
-- Represents a physical table in the club.
-- secret_key is embedded in the QR code URL to authenticate access.

create table if not exists tables (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,         -- e.g. "Table 1", "VIP Room"
  secret_key text not null unique,  -- random secret embedded in QR URL
  created_at timestamptz not null default now()
);

-- ─── Orders ────────────────────────────────────────────────────────────────────
-- One order = one submission by a device at a table.
-- A device can submit multiple orders during a 12h session.

create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  table_id   uuid not null references tables(id) on delete cascade,
  session_id text not null,         -- random UUID per device, stored in localStorage
  status     text not null default 'pending' check (status in ('pending', 'done')),
  note       text,                  -- optional customer note
  total      integer not null default 0, -- total in yen (sum of items)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Order Items ───────────────────────────────────────────────────────────────
-- Line items within an order.
-- Item details are snapshotted from Sanity at order time (price may change).

create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  item_key     text not null,      -- Sanity item _key (for reference only)
  item_name_en text not null,
  item_name_ja text,
  price        integer not null,   -- unit price in yen
  quantity     integer not null default 1 check (quantity > 0)
);

-- ─── updated_at trigger ────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────
-- The API routes use the service role key (server-side only) so RLS is not
-- strictly required, but enabling it prevents accidental client-side exposure.

alter table tables      enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Service role bypasses RLS — no policies needed for server-side access.
-- If you ever add client-side Supabase calls, add policies here.

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable realtime for the admin dashboard live feed.
-- Run in Supabase Dashboard → Database → Replication → enable for these tables.
--
-- alter publication supabase_realtime add table orders;
-- alter publication supabase_realtime add table order_items;
--
-- (Uncomment and run separately if needed — some Supabase plans require this.)
