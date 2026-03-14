import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type GameScore = {
  id: number
  game_id: string
  score: number
  total: number
  created_at: string
}

export async function saveScore(gameId: string, score: number, total: number) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
