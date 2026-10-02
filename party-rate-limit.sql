-- =============================================================================
-- 20-party-rate-limit.sql
-- Per-IP rate limiting for the public party-public-submit endpoint.
-- Self-contained: only adds party_rate_limit + fn_party_rate_limit.
-- =============================================================================

begin;

create table if not exists public.party_rate_limit (
  ip           text not null,
  window_start timestamptz not null,
  count        integer not null default 1,
  primary key (ip, window_start)
);

-- Atomically increment (or seed) the hourly counter for an IP and return the
-- new count. The edge function compares the result against its per-hour limit.
create or replace function public.fn_party_rate_limit(p_ip text, p_window timestamptz)
returns integer
language plpgsql
as $$
declare
  new_count integer;
begin
  insert into public.party_rate_limit (ip, window_start, count)
  values (p_ip, p_window, 1)
  on conflict (ip, window_start)
  do update set count = public.party_rate_limit.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

grant execute on function public.fn_party_rate_limit(text, timestamptz) to service_role;

commit;
