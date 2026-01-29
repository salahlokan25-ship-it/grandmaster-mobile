-- Safe Setup Script
-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixed_id VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe migration to add fixed_id if table exists but column is missing
DO $mig$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='fixed_id') THEN
        ALTER TABLE public.users ADD COLUMN fixed_id VARCHAR(50) UNIQUE;
    END IF;
END $mig$;

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_users_fixed_id ON public.users(fixed_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. Function to generate a unique fixed ID (10 digits)
CREATE OR REPLACE FUNCTION public.generate_fixed_id()
RETURNS TEXT AS $body$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := lpad(floor(random() * 10000000000)::text, 10, '0');
    SELECT EXISTS(SELECT 1 FROM public.users WHERE fixed_id = new_id) INTO id_exists;
    IF NOT id_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$body$ LANGUAGE plpgsql;

-- 4. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 6. Create team invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  invitee_fixed_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- 7. Create team join requests table
CREATE TABLE IF NOT EXISTS public.team_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $body$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$body$ LANGUAGE plpgsql;

-- 9. Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- RLS RECURSION BREAKERS (SECURITY DEFINER FUNCTIONS)
-- =================================================================

CREATE OR REPLACE FUNCTION public.check_is_team_member(t_id UUID)
RETURNS BOOLEAN AS $body$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE team_id = t_id 
    AND user_id = auth.uid()
  );
END;
$body$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_is_team_owner(t_id UUID)
RETURNS BOOLEAN AS $body$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = t_id 
    AND owner_id = auth.uid()
  );
END;
$body$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- RLS POLICIES
-- =================================================================

-- USERS: Enable public discovery by UID
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users are viewable" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.users;
CREATE POLICY "Public profiles are viewable" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- =================================================================
-- ABSOLUTE RLS RESET (FIX 42501 ON TEAMS)
-- =================================================================

-- 1. Disable RLS temporarily to ensure no policies interfere with dropping
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- 2. Drop EVERY possible policy name to be safe
DROP POLICY IF EXISTS "Team members can view team" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team owner can update team" ON public.teams;
DROP POLICY IF EXISTS "Team owner can delete team" ON public.teams;
DROP POLICY IF EXISTS "Teams are viewable by owners and members" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Owners can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Owners can delete their teams" ON public.teams;

DROP POLICY IF EXISTS "Team members can view members" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can add members" ON public.team_members;
DROP POLICY IF EXISTS "Members/Owners can view team membership" ON public.team_members;
DROP POLICY IF EXISTS "Owners can manage team membership" ON public.team_members;

-- 3. Re-enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply simplified, explicit policies
CREATE POLICY "Teams are viewable by owners and members" ON public.teams
    FOR SELECT TO authenticated
    USING (owner_id = auth.uid() OR public.check_is_team_member(id));

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their teams" ON public.teams
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their teams" ON public.teams
    FOR DELETE TO authenticated
    USING (owner_id = auth.uid());

-- MEMBERS policies
CREATE POLICY "Members/Owners can view team membership" ON public.team_members
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.check_is_team_owner(team_id));

CREATE POLICY "Owners can manage team membership" ON public.team_members
    FOR INSERT TO authenticated
    WITH CHECK (public.check_is_team_owner(team_id) OR user_id = auth.uid());

-- 5. Force schema refresh (Supabase Dashboard trick)
COMMENT ON TABLE public.teams IS 'Tactical squads for grandmasters';
NOTIFY pgrst, 'reload schema';



-- =================================================================
-- SUPER RESET: INVITATIONS & DISCOVERY (FIX 42501)
-- =================================================================

-- 1. Enable Public Discovery (Essential for searching teammates)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.users;
CREATE POLICY "Public profiles are viewable" ON public.users FOR SELECT USING (true);

-- 2. TEAM INVITATIONS: Complete Wipe
ALTER TABLE public.team_invitations DISABLE ROW LEVEL SECURITY;
-- Drop ALL possible names (Old and New)
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON public.team_invitations;
DROP POLICY IF EXISTS "Team owners can view team invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Team owners can send invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can update their invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Invitations sent to me" ON public.team_invitations;
DROP POLICY IF EXISTS "Invitations I sent" ON public.team_invitations;
DROP POLICY IF EXISTS "Send team invitation" ON public.team_invitations;
DROP POLICY IF EXISTS "Manage my invitations" ON public.team_invitations;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitations sent to me" ON public.team_invitations
    FOR SELECT TO authenticated
    USING (invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Invitations I sent" ON public.team_invitations
    FOR SELECT TO authenticated
    USING (inviter_id = auth.uid() OR public.check_is_team_owner(team_id));

CREATE POLICY "Send team invitation" ON public.team_invitations
    FOR INSERT TO authenticated
    WITH CHECK (inviter_id = auth.uid() AND public.check_is_team_owner(team_id));

CREATE POLICY "Manage my invitations" ON public.team_invitations
    FOR ALL TO authenticated
    USING (invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid()));

-- 3. GAME INVITATIONS: Complete Wipe
ALTER TABLE public.game_invitations DISABLE ROW LEVEL SECURITY;
-- Drop ALL possible names (Old and New)
DROP POLICY IF EXISTS "Users can view game invitations sent to them" ON public.game_invitations;
DROP POLICY IF EXISTS "Users can view game invitations they sent" ON public.game_invitations;
DROP POLICY IF EXISTS "Users can send game invitations" ON public.game_invitations;
DROP POLICY IF EXISTS "Invitee can update game invitation status" ON public.game_invitations;
DROP POLICY IF EXISTS "Game invites sent to me" ON public.game_invitations;
DROP POLICY IF EXISTS "Game invites I sent" ON public.game_invitations;
ALTER TABLE public.game_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game invites sent to me" ON public.game_invitations
    FOR ALL TO authenticated
    USING (invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Game invites I sent" ON public.game_invitations
    FOR ALL TO authenticated
    USING (inviter_id = auth.uid());

-- 4. Force Repair User IDs (Ensure 10-digit padding for everyone)
UPDATE public.users SET fixed_id = lpad(fixed_id, 10, '0') WHERE length(fixed_id) < 10;

-- 5. Final Notify
COMMENT ON TABLE public.team_invitations IS 'Recruitment orders';
NOTIFY pgrst, 'reload schema';

-- 8. Create game invitations table
CREATE TABLE IF NOT EXISTS public.game_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  invitee_fixed_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
  game_id UUID, -- References active_games after acceptance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 day')
);

-- Enable RLS for game invitations
ALTER TABLE public.game_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game invitations
DROP POLICY IF EXISTS "Users can view game invitations sent to them" ON public.game_invitations;
CREATE POLICY "Users can view game invitations sent to them" ON public.game_invitations
    FOR SELECT USING (
        invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can view game invitations they sent" ON public.game_invitations;
CREATE POLICY "Users can view game invitations they sent" ON public.game_invitations
    FOR SELECT USING (inviter_id = auth.uid());

DROP POLICY IF EXISTS "Users can send game invitations" ON public.game_invitations;
CREATE POLICY "Users can send game invitations" ON public.game_invitations
    FOR INSERT WITH CHECK (inviter_id = auth.uid());

DROP POLICY IF EXISTS "Users can update game invitations" ON public.game_invitations;
CREATE POLICY "Users can update game invitations" ON public.game_invitations
    FOR UPDATE USING (
        inviter_id = auth.uid() OR 
        invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid())
    );

-- 9. Create active games table for synchronization
CREATE TABLE IF NOT EXISTS public.active_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  black_player_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  fen TEXT DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  last_move TEXT,
  last_move_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'draw'
  winner_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for active games
ALTER TABLE public.active_games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for active games
DROP POLICY IF EXISTS "Players can view their active games" ON public.active_games;
CREATE POLICY "Players can view their active games" ON public.active_games
    FOR SELECT USING (white_player_id = auth.uid() OR black_player_id = auth.uid());

DROP POLICY IF EXISTS "Players can update their active games" ON public.active_games;
CREATE POLICY "Players can update their active games" ON public.active_games
    FOR UPDATE USING (white_player_id = auth.uid() OR black_player_id = auth.uid());

DROP POLICY IF EXISTS "Players can create their active games" ON public.active_games;
CREATE POLICY "Players can create their active games" ON public.active_games
    FOR INSERT WITH CHECK (white_player_id = auth.uid() OR black_player_id = auth.uid());

-- Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_games;

NOTIFY pgrst, 'reload schema';

-- =================================================================
-- FRIENDS SYSTEM (NEW)
-- =================================================================

-- 1. Create friendships table
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 2. Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- 3. Simplified RLS Policies
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
CREATE POLICY "Users can view their own friendships" ON public.friendships
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR friend_id = auth.uid());

DROP POLICY IF EXISTS "Users can send friend requests" ON public.friendships;
CREATE POLICY "Users can send friend requests" ON public.friendships
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can accept friend requests" ON public.friendships;
CREATE POLICY "Users can accept friend requests" ON public.friendships
    FOR UPDATE TO authenticated
    USING (friend_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete friendships" ON public.friendships;
CREATE POLICY "Users can delete friendships" ON public.friendships
    FOR DELETE TO authenticated
    USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Force reload schema
COMMENT ON TABLE public.friendships IS 'Grandmaster social circle';
NOTIFY pgrst, 'reload schema';

-- Invitee can update game invitation status
DROP POLICY IF EXISTS "Invitee can update game invitation status" ON public.game_invitations;
CREATE POLICY "Invitee can update game invitation status" ON public.game_invitations
    FOR UPDATE USING (
        invitee_fixed_id IN (SELECT fixed_id FROM public.users WHERE id = auth.uid())
    );

-- =================================================================
-- AUTH TRIGGERS (THE ABSOLUTE FIX)
-- =================================================================

-- 12. Auto-confirm Function (BEFORE INSERT)
CREATE OR REPLACE FUNCTION public.handle_auto_confirm()
RETURNS TRIGGER AS $body$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.last_sign_in_at = NOW();
  RETURN NEW;
END;
$body$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Robust Profile Creation (AFTER INSERT)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $body$
DECLARE
  new_fixed_id TEXT;
  final_username TEXT;
BEGIN
  new_fixed_id := public.generate_fixed_id();
  final_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  
  IF EXISTS (SELECT 1 FROM public.users WHERE username = final_username) THEN
    final_username := final_username || '_' || new_fixed_id;
  END IF;

  INSERT INTO public.users (id, email, username, display_name, fixed_id, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', final_username),
    new_fixed_id,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$body$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Apply Triggers to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auto_confirm();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================
-- EMERGENCY REPAIR: FIX ALL EXISTING USERS
-- =================================================================

-- A. Confirm all existing emails
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- B. Repair short UIDs to 10 digits
UPDATE public.users 
SET fixed_id = lpad(fixed_id, 10, '0') 
WHERE length(fixed_id) < 10;

-- C. Create missing profiles for existing auth users
INSERT INTO public.users (id, email, username, display_name, fixed_id)
SELECT 
  id, 
  email, 
  split_part(email, '@', 1) || '_' || lpad(floor(random() * 1000)::text, 4, '0'),
  split_part(email, '@', 1),
  public.generate_fixed_id()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- REALTIME SETUP
-- =================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_invitations;
