-- Team Chat System
-- 1. Create team_messages table
CREATE TABLE IF NOT EXISTS public.team_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Team members can view messages" ON public.team_messages;
CREATE POLICY "Team members can view messages" ON public.team_messages
    FOR SELECT TO authenticated
    USING (
        public.check_is_team_member(team_id) OR 
        public.check_is_team_owner(team_id)
    );

DROP POLICY IF EXISTS "Team members can send messages" ON public.team_messages;
CREATE POLICY "Team members can send messages" ON public.team_messages
    FOR INSERT TO authenticated
    WITH CHECK (
        sender_id = auth.uid() AND
        (public.check_is_team_member(team_id) OR public.check_is_team_owner(team_id))
    );

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;

-- 5. Force schema refresh
NOTIFY pgrst, 'reload schema';
