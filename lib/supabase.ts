import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type GameScore = {
  id: number
  game_id: string
  score: number
  total: number
  created_at: string
}

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) return null
  try {
    return createClient(url, key)
  } catch {
    return null
  }
}

export async function saveScore(gameId: string, score: number, total: number): Promise<GameScore | null> {
  const client = getClient()
  if (!client) return null

  const { data, error } = await client
    .from('game_scores')
    .insert([{ game_id: gameId, score, total }])
    .select()
    .single()

  if (error) {
    console.error('Error saving score:', error)
    return null
  }
  return data as GameScore
}

export async function getLastScore(gameId: string): Promise<GameScore | null> {
  const client = getClient()
  if (!client) return null

  const { data, error } = await client
    .from('game_scores')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // no rows
    console.error('Error fetching score:', error)
    return null
  }
  return data as GameScore
}
