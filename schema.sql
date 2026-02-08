-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- VENDORS TABLE
create table vendors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text,
  contact_info text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROCEDURES TABLE
create table procedures (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references vendors(id) on delete cascade not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BROKERS TABLE (Extends Auth Users or Standalone)
create table brokers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Nullable for now if not fully integrated with Auth
  name text not null,
  email text,
  whatsapp text,
  status text default 'nuevo', -- nuevo, contactado, procedimientos, cerrado, perdido
  company text,
  notes text,
  assigned_procedures jsonb default '[]'::jsonb, -- Array of procedure IDs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Row Level Security) - Basic Setup
alter table vendors enable row level security;
alter table procedures enable row level security;
alter table brokers enable row level security;

-- Allow read access to everyone for now (Public API) - TO BE REFINED
create policy "Allow public read access on vendors" on vendors for select using (true);
create policy "Allow public read access on procedures" on procedures for select using (true);
create policy "Allow public read access on brokers" on brokers for select using (true);

-- Allow insert/update/delete mainly for authenticated users or anon (during dev)
create policy "Allow full access on vendors" on vendors using (true) with check (true);
create policy "Allow full access on procedures" on procedures using (true) with check (true);
create policy "Allow full access on brokers" on brokers using (true) with check (true);
