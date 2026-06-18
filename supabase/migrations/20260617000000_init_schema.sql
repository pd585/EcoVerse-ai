-- Clean setup: enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ─── 1. TABLES ──────────────────────────────────────────────────────────────

-- Profiles Table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  username text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Carbon Profiles Table
create table public.carbon_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  carbon_score numeric,
  annual_emissions numeric,
  last_calculated timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simulator Runs Table
create table public.simulator_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scenario_name text,
  footprint_before numeric,
  footprint_after numeric,
  score_change numeric,
  created_at timestamptz not null default now()
);

-- Roadmap Progress Table
create table public.roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  milestone_key text not null,
  completed boolean not null default false,
  progress_percentage integer not null default 0,
  completed_at timestamptz
);

-- Achievements Table
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_key text unique not null,
  title text not null,
  description text,
  xp_reward integer not null default 0,
  created_at timestamptz not null default now()
);

-- User Achievements Table
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

-- EcoJump Scores Table
create table public.ecojump_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null default 0,
  coins integer not null default 0,
  created_at timestamptz not null default now()
);

-- AI Conversations Table
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ─── 2. TRIGGERS & SYNC FUNCTIONS ───────────────────────────────────────────

-- New User Profile Sync Function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution link (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Timestamp Update Function
create or replace function public.handle_update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Timestamp update triggers (idempotent)
drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_update_timestamp();

drop trigger if exists on_carbon_profile_updated on public.carbon_profiles;
create trigger on_carbon_profile_updated
  before update on public.carbon_profiles
  for each row execute procedure public.handle_update_timestamp();

-- ─── 3. INDEXES ─────────────────────────────────────────────────────────────

-- User Lookups
create index idx_carbon_profiles_user_id on public.carbon_profiles(user_id);
create index idx_simulator_runs_user_id on public.simulator_runs(user_id);
create index idx_roadmap_progress_user_id on public.roadmap_progress(user_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_ecojump_scores_user_id on public.ecojump_scores(user_id);

-- Timelines (Ordering)
create index idx_simulator_runs_created_at on public.simulator_runs(created_at desc);

-- EcoJump Leaderboard Index (Optimized for desc score sorting)
create index idx_ecojump_scores_score_desc on public.ecojump_scores(score desc);

-- AI Coach conversations (Composite index: filters by user_id and sorts by created_at DESC)
create index idx_ai_conversations_user_created on public.ai_conversations(user_id, created_at desc);

-- Roadmap Keys
create index idx_roadmap_progress_milestone_key on public.roadmap_progress(milestone_key);

-- Achievements Keys
create index idx_user_achievements_achievement_id on public.user_achievements(achievement_id);

-- ─── 4. ROW LEVEL SECURITY (RLS) & POLICIES ────────────────────────────────

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.carbon_profiles enable row level security;
alter table public.simulator_runs enable row level security;
alter table public.roadmap_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.ecojump_scores enable row level security;
alter table public.ai_conversations enable row level security;

-- Profiles Policies
create policy "Users can view own profile."
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Carbon Profiles Policies
create policy "Users can view own carbon profiles."
  on public.carbon_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own carbon profiles."
  on public.carbon_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own carbon profiles."
  on public.carbon_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Simulator Runs Policies
create policy "Users can view own simulator runs."
  on public.simulator_runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own simulator runs."
  on public.simulator_runs for insert
  with check (auth.uid() = user_id);

-- Roadmap Progress Policies
create policy "Users can view own roadmap progress."
  on public.roadmap_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own roadmap progress."
  on public.roadmap_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own roadmap progress."
  on public.roadmap_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Achievements Metadata Policies (Global Read)
create policy "Achievements are globally readable."
  on public.achievements for select
  using (true);

-- User Achievements Policies
create policy "Users can view own unlocked achievements."
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert own unlocked achievements."
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create policy "Users can update own unlocked achievements."
  on public.user_achievements for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- EcoJump Scores Policies
create policy "Users can view own game scores."
  on public.ecojump_scores for select
  using (auth.uid() = user_id);

-- EcoJump Scores Insert Policy
create policy "Users can insert own game scores."
  on public.ecojump_scores for insert
  with check (auth.uid() = user_id);

-- AI Conversations Policies
create policy "Users can view own AI conversations."
  on public.ai_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own AI conversations."
  on public.ai_conversations for insert
  with check (auth.uid() = user_id);
