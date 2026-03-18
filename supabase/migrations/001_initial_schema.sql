-- notes table
create table public.notes (
    id text primary key,
    user_id uuid not null references auth.users (id) on delete cascade,
    x float8 not null,
    y float8 not null,
    text text not null default '',
    kind text not null default 'sticky',
    title text,
    markdown text,
    width float8,
    height float8,
    color text not null default 'yellow',
    rotation float8,
    created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "Users manage own notes" on public.notes for all using (auth.uid () = user_id);

-- canvas_state table
create table public.canvas_state (
    user_id uuid primary key references auth.users (id) on delete cascade,
    x float8 not null default 0,
    y float8 not null default 0,
    scale float8 not null default 1,
    has_seen_hint boolean not null default false
);

alter table public.canvas_state enable row level security;

create policy "Users manage own canvas state" on public.canvas_state for all using (auth.uid () = user_id);