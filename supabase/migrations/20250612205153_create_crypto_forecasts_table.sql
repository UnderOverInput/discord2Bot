create table crypto_forecasts (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  forecast_timestamp timestamptz not null,
  predicted_price double precision not null,
  lower_bound double precision not null,
  upper_bound double precision not null,
  recorded_at timestamptz default now() not null
);

alter table crypto_forecasts enable row level security;

create policy "Allow public insert" on crypto_forecasts for insert with check (true);
