import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssessmentResult {
  id?: string
  email: string
  first_name: string
  instrument: 'snapshot' | 'enterprise'
  responses: Record<string, number>
  pillar_scores: Record<string, number>
  grace_score: number | null
  total_score: number
  band: string
  strength_pillar: string
  vulnerability_pillar: string
  created_at?: string
  enterprise_token?: string | null
}

export interface HabitEntry {
  id?: string
  user_email: string
  date: string
  pillar: string
  habit_text: string
  completed: boolean
  notes?: string
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export async function saveAssessmentResult(data: AssessmentResult): Promise<AssessmentResult> {
  const { data: result, error } = await supabase
    .from('assessment_results')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return result as AssessmentResult
}

export async function getAssessmentResult(id: string): Promise<AssessmentResult> {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as AssessmentResult
}

export async function getUserResults(email: string): Promise<AssessmentResult[]> {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as AssessmentResult[]
}

// ─── Enterprise token validation ─────────────────────────────────────────────

export async function validateEnterpriseToken(token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('enterprise_tokens')
    .select('id')
    .eq('token', token)
    .eq('active', true)
    .single()
  if (error) return false
  return data !== null
}

export async function consumeEnterpriseToken(token: string, email: string): Promise<void> {
  await supabase
    .from('enterprise_tokens')
    .update({ used_by: email, used_at: new Date().toISOString() })
    .eq('token', token)
}

// ─── Email / nurture trigger ──────────────────────────────────────────────────

export async function triggerNurtureEmail(params: {
  email: string
  firstName: string
  resultId: string
  band: string
  strengthPillar: string
  vulnerabilityPillar: string
}): Promise<void> {
  const { error } = await supabase.functions.invoke('send-results-email', {
    body: params,
  })
  if (error) console.error('Email trigger failed:', error)
}

// ─── Habit Tracker ────────────────────────────────────────────────────────────

export async function getHabits(
  email: string,
  dateFrom: string,
  dateTo: string
): Promise<HabitEntry[]> {
  const { data, error } = await supabase
    .from('habit_entries')
    .select('*')
    .eq('user_email', email)
    .gte('date', dateFrom)
    .lte('date', dateTo)
    .order('date', { ascending: false })
  if (error) throw error
  return data as HabitEntry[]
}

export async function upsertHabit(entry: HabitEntry): Promise<HabitEntry> {
  const { data, error } = await supabase
    .from('habit_entries')
    .upsert([entry], { onConflict: 'user_email,date,habit_text' })
    .select()
    .single()
  if (error) throw error
  return data as HabitEntry
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habit_entries').delete().eq('id', id)
  if (error) throw error
}

// ─── Supabase SQL migration ───────────────────────────────────────────────────
// Run this once in your Supabase SQL editor (supabase.com → project → SQL Editor):
//
// create table if not exists assessment_results (
//   id uuid primary key default gen_random_uuid(),
//   email text not null,
//   first_name text not null,
//   instrument text not null check (instrument in ('snapshot','enterprise')),
//   responses jsonb not null default '{}',
//   pillar_scores jsonb not null default '{}',
//   grace_score int,
//   total_score int not null default 0,
//   band text not null,
//   strength_pillar text not null,
//   vulnerability_pillar text not null,
//   enterprise_token text,
//   created_at timestamptz not null default now()
// );
//
// create table if not exists enterprise_tokens (
//   id uuid primary key default gen_random_uuid(),
//   token text unique not null,
//   active boolean not null default true,
//   org_name text,
//   seats int not null default 1,
//   used_by text,
//   used_at timestamptz,
//   created_at timestamptz not null default now()
// );
//
// create table if not exists habit_entries (
//   id uuid primary key default gen_random_uuid(),
//   user_email text not null,
//   date date not null,
//   pillar text not null,
//   habit_text text not null,
//   completed boolean not null default false,
//   notes text,
//   created_at timestamptz not null default now(),
//   unique (user_email, date, habit_text)
// );
//
// alter table assessment_results enable row level security;
// alter table habit_entries enable row level security;
// alter table enterprise_tokens enable row level security;
//
// create policy "insert_results" on assessment_results for insert with check (true);
// create policy "select_results" on assessment_results for select using (true);
// create policy "insert_habits"  on habit_entries for insert with check (true);
// create policy "select_habits"  on habit_entries for select using (true);
// create policy "update_habits"  on habit_entries for update using (true);
// create policy "delete_habits"  on habit_entries for delete using (true);
// create policy "select_tokens"  on enterprise_tokens for select using (true);
// create policy "update_tokens"  on enterprise_tokens for update using (true);
