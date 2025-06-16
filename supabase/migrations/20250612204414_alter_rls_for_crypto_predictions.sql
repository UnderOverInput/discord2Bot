alter table crypto_predictions enable row level security;

create policy "Allow public insert" on crypto_predictions for insert with check (true);
