-- Create the api_keys table if it doesn't exist
create table if not exists api_keys (
  id uuid primary key,
  name text not null,
  key text not null unique,
  type text not null default 'dev',
  usage integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table api_keys enable row level security;

-- Create policies
create policy "Enable read access for all users" on api_keys
  for select
  using (true);

create policy "Enable insert access for all users" on api_keys
  for insert
  with check (true);

create policy "Enable update access for all users" on api_keys
  for update
  using (true)
  with check (true);

create policy "Enable delete access for all users" on api_keys
  for delete
  using (true); 