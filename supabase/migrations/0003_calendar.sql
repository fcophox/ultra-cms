-- ============================================================================
-- Complemento Calendario — disponibilidad semanal recurrente
-- Una fila por día de la semana (0 = Lunes … 6 = Domingo).
-- ============================================================================

create table if not exists public.calendar_availability (
  weekday          smallint primary key check (weekday between 0 and 6),
  full_day_blocked boolean not null default false,
  blocked_slots    jsonb   not null default '[]'::jsonb,  -- ["18:30","18:45"]
  updated_at       timestamptz not null default now()
);

alter table public.calendar_availability enable row level security;

-- Lectura pública (el formulario de contacto leerá la disponibilidad);
-- escritura solo para admins autenticados.
create policy "calendar_public_read" on public.calendar_availability
  for select using (true);
create policy "calendar_admin_write" on public.calendar_availability
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Inicializa los 7 días como disponibles.
insert into public.calendar_availability (weekday)
select generate_series(0, 6)::smallint
on conflict (weekday) do nothing;
