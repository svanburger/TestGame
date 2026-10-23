-- =====================================================================
--  FAMILJENS TOPPLISTA I SUPABASE
--
--  Klistra in allt det här i Supabase: SQL Editor → New query → Run.
--  Det skapar en tabell och två funktioner. Spelen pratar bara med
--  funktionerna, aldrig direkt med tabellen, så utan rätt familjekod
--  kan man inte se eller ändra någon annans topplista.
--
--  Det går bra att köra filen igen om man har ändrat i den.
-- =====================================================================

create table if not exists public.topplista (
  id bigint generated always as identity primary key,
  familj text not null check (familj ~ '^[A-Z0-9]{8}$'),
  spel text not null check (spel ~ '^[a-z]{2,20}$'),
  namn text not null check (char_length(namn) between 1 and 20),
  poang integer not null check (poang > 0 and poang < 10000000),
  tid bigint not null, -- När resultatet kom, i millisekunder (från enheten)
  skapad timestamptz not null default now(),
  -- Samma resultat sparas bara en gång, även om enheten skickar det igen
  unique (familj, spel, tid, namn)
);

create index if not exists topplista_familj_spel on public.topplista (familj, spel, poang desc);

-- Ingen kommer åt tabellen direkt, bara genom funktionerna här nedanför
alter table public.topplista enable row level security;
revoke all on table public.topplista from anon, authenticated;

-- Sparar ett resultat
create or replace function public.spara_resultat(p_familj text, p_spel text, p_namn text, p_poang integer, p_tid bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.topplista (familj, spel, namn, poang, tid)
  values (upper(p_familj), p_spel, btrim(p_namn), p_poang, p_tid)
  on conflict (familj, spel, tid, namn) do nothing;
$$;

-- Hämtar de 10 bästa i varje spel för en familj
create or replace function public.hamta_topplista(p_familj text)
returns table (spel text, namn text, poang integer, tid bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select t.spel, t.namn, t.poang, t.tid
  from (
    select r.spel, r.namn, r.poang, r.tid,
           row_number() over (partition by r.spel order by r.poang desc, r.tid asc) as plats
    from public.topplista r
    where r.familj = upper(p_familj)
  ) t
  where t.plats <= 10
  order by t.spel, t.plats;
$$;

revoke all on function public.spara_resultat(text, text, text, integer, bigint) from public;
revoke all on function public.hamta_topplista(text) from public;
grant execute on function public.spara_resultat(text, text, text, integer, bigint) to anon, authenticated;
grant execute on function public.hamta_topplista(text) to anon, authenticated;
