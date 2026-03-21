'use server'

import { createClient } from '@/lib/supabase/server'

export interface WriteResult {
  success: boolean
  error?: string
  entry?: { id: string; content: string; created_at: string }
}

export async function submitEntry(content: string): Promise<WriteResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: '请先登录' }
  }

  const { data, error: insertError } = await supabase
    .from('entries')
    .insert({ user_id: user.id, content: content.trim() })
    .select('id, content, created_at')
    .single()

  if (insertError) {
    return { success: false, error: '保存失败，请稍后重试' }
  }

  return { success: true, entry: data }
}

export async function getTodayEntries(): Promise<{ entries: WriteResult['entry'][] }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { entries: [] }

  const todayStart = new Date(new Date().toDateString()).toISOString()
  const todayEnd = new Date(new Date(new Date().toDateString()).getTime() + 86400000).toISOString()

  const { data } = await supabase
    .from('entries')
    .select('id, content, created_at')
    .eq('user_id', user.id)
    .gte('created_at', todayStart)
    .lt('created_at', todayEnd)
    .order('created_at', { ascending: false })

  return { entries: data ?? [] }
}
