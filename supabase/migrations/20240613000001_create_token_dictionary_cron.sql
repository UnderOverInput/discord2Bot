-- Create a cron job to update token dictionary daily at 00:00 UTC
select
  cron.schedule(
    'update-token-dictionary', -- job name
    '0 0 * * *', -- cron schedule (every day at midnight UTC)
    $$
    select
      net.http_post(
        url := current_setting('app.settings.functions_url') || '/update-token-dictionary',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        )
      ) as request_id;
    $$
  );

-- Add a function to manually trigger the update
create or replace function trigger_token_dictionary_update()
returns void
language plpgsql
security definer
as $$
begin
  perform
    net.http_post(
      url := current_setting('app.settings.functions_url') || '/update-token-dictionary',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      )
    );
end;
$$; 