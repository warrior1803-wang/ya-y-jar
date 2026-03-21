'use server'

import { createClient } from '@/lib/supabase/server'

export interface EntryResult {
  entry: { id: string; content: string; created_at: string } | null
  hasEntries: boolean
}

export async function getRandomEntry(): Promise<EntryResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { entry: null, hasEntries: false }

  const { count } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (!count) return { entry: null, hasEntries: false }

  const offset = Math.floor(Math.random() * count)
  const { data } = await supabase
    .from('entries')
    .select('id, content, created_at')
    .eq('user_id', user.id)
    .range(offset, offset)
    .single()

  return { entry: data ?? null, hasEntries: true }
}

export async function getEntryCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return count ?? 0
}
