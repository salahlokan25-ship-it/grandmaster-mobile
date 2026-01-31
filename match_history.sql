-- Match History Table for Online and AI games
CREATE TABLE IF NOT EXISTS public.match_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  game_mode VARCHAR(20) NOT NULL, -- 'online' or 'ai'
  result VARCHAR(20) NOT NULL, -- 'win', 'loss', 'draw'
  opponent_id UUID REFERENCES public.users(id), -- For online games
  ai_difficulty VARCHAR(20), -- For AI games
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own match history" ON public.match_history;
CREATE POLICY "Users can view their own match history" ON public.match_history
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can record their own match results" ON public.match_history;
CREATE POLICY "Users can record their own match results" ON public.match_history
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_history;

-- Create view for winrates
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  user_id,
  COUNT(*) as total_games,
  COUNT(*) FILTER (WHERE result = 'win') as wins,
  COUNT(*) FILTER (WHERE result = 'loss') as losses,
  COUNT(*) FILTER (WHERE result = 'draw') as draws,
  ROUND(CAST(COUNT(*) FILTER (WHERE result = 'win') AS NUMERIC) / NULLIF(COUNT(*), 0) * 100, 2) as win_rate
FROM public.match_history
GROUP BY user_id;
