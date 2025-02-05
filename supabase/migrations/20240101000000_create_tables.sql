-- Create tables for custom items
create table if not exists custom_inclusions (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists custom_exclusions (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists custom_terms (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for package templates
create table if not exists package_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_package_templates_name on package_templates(name);