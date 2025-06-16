DO $$
BEGIN
  create policy "Allow insert for all users"
    on public.crypto_predictions
    for insert
    to public
    with check (true);
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'policy "Allow insert for all users" on public.crypto_predictions already exists, skipping creation';
END;
$$; 