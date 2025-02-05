-- Add booking_status field to itineraries table
alter table if exists itineraries
  add column if not exists booking_status text not null default 'Created';

-- Create index for booking_status
create index if not exists idx_itineraries_booking_status on itineraries(booking_status);