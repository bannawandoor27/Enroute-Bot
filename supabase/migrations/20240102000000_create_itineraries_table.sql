-- Create table for storing generated itineraries
create table if not exists itineraries (
  id uuid default uuid_generate_v4() primary key,
  booking_code text not null unique,
  username text not null,
  brand text not null check (brand in ('enroute', 'backpack')),
  itinerary_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_itineraries_booking_code on itineraries(booking_code);
create index if not exists idx_itineraries_username on itineraries(username);
create index if not exists idx_itineraries_brand on itineraries(brand);