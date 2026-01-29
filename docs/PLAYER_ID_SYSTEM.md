# Player ID System: Technical Specification (Supabase)

## 1. Database Schema (Supabase PostgreSQL)

### Table: `users`
Each user has a UUID primary key and a fixed 8-digit ID.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key (Supabase Auth UID) |
| `fixed_id` | `VARCHAR(50)` | **Fixed Identifier**. 8-digit numeric string. DNA-stable. |
| `email` | `VARCHAR(255)` | **Fixed Field**. Initial account email. Non-updatable. |
| `username` | `VARCHAR(100)` | User's display name. |
| `display_name` | `VARCHAR(255)` | User's preferred display name. |
| `avatar_url` | `TEXT` | URL to user's profile picture. |
| `created_at` | `TIMESTAMP` | Account creation timestamp. |
| `updated_at` | `TIMESTAMP` | Last update timestamp. |

### Table: `teams`
Team management system.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `name` | `VARCHAR(255)` | Team name. |
| `description` | `TEXT` | Team description (optional). |
| `owner_id` | `UUID` | Foreign key to `users.id`. |
| `created_at` | `TIMESTAMP` | Team creation timestamp. |
| `updated_at` | `TIMESTAMP` | Last update timestamp. |

### Table: `team_members`
Team membership management.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `team_id` | `UUID` | Foreign key to `teams.id`. |
| `user_id` | `UUID` | Foreign key to `users.id`. |
| `role` | `VARCHAR(50)` | Member role: 'owner', 'admin', 'member'. |
| `joined_at` | `TIMESTAMP` | When user joined the team. |

### Table: `team_invitations`
Invitation system using fixed IDs.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `team_id` | `UUID` | Foreign key to `teams.id`. |
| `inviter_id` | `UUID` | Foreign key to `users.id` (who sent invitation). |
| `invitee_fixed_id` | `VARCHAR(50)` | **8-digit User ID** of the target user. |
| `status` | `VARCHAR(50)` | 'pending', 'accepted', 'declined', 'expired'. |
| `message` | `TEXT` | Personal invitation message (optional). |
| `created_at` | `TIMESTAMP` | When invitation was sent. |
| `expires_at` | `TIMESTAMP` | When invitation expires (7 days). |

### Table: `team_join_requests`
Join request system.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary key. |
| `team_id` | `UUID` | Foreign key to `teams.id`. |
| `requester_id` | `UUID` | Foreign key to `users.id` (who requested to join). |
| `status` | `VARCHAR(50)` | 'pending', 'accepted', 'declined'. |
| `message` | `TEXT` | Personal request message (optional). |
| `created_at` | `TIMESTAMP` | When request was made. |

---

## 2. API Reference (Zustand Stores)

### `useAuthStore`
Manages authentication and user state.
- `user`: Supabase Auth user object.
- `profile`: User profile from `users` table.
- `profile.fixed_id`: The 8-digit numeric ID for invitations.
- `signUp(email, password, username, displayName)`: Creates new user with fixed ID.
- `signIn(email, password)`: Authenticates existing user.
- `signOut()`: Logs out current user.
- `updateProfile(updates)`: Updates user profile.

### `TeamService`
Handles team management via fixed IDs.
- `createTeam(name, description)`: Creates new team (user becomes owner).
- `sendTeamInvitation(teamId, inviteeFixedId, message)`: 
  - Validates 8-digit ID format.
  - Sends invitation to specific user by their fixed ID.
- `getUserInvitations()`: 
  - Gets all invitations sent to current user's fixed ID.
- `acceptInvitation(invitationId)`: Accepts team invitation.
- `declineInvitation(invitationId)`: Declines team invitation.
- `getTeamMembers(teamId)`: Lists all team members with their fixed IDs.

---

## 3. Fixed ID Generation Logic

### Function: `generate_fixed_id()`
```sql
CREATE OR REPLACE FUNCTION generate_fixed_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := lpad(floor(random() * 100000000)::text, 8, '0');
    SELECT EXISTS(SELECT 1 FROM users WHERE fixed_id = new_id) INTO id_exists;
    IF NOT id_exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

### Uniqueness Process:
1. Generate random 8-digit number (00000000-99999999).
2. Query `users` table: `WHERE fixed_id = newId`.
3. If entry exists, repeat step 1.
4. If unique, assign to new user during registration.

---

## 4. Security Features

### Row Level Security (RLS)
- Users can only view/update their own profile.
- Team members can only view teams they belong to.
- Users can only view invitations sent to their fixed ID.
- Team owners can manage invitations and join requests.

### Data Validation
- Fixed IDs are exactly 8 digits.
- Email addresses are unique and validated.
- Usernames are unique and non-empty.
- Team names are required and unique per owner.

---

## 5. User Invitation Flow

### Step-by-Step Process:
1. **User A** shares their 8-digit ID: `12345678`
2. **User B** (team owner) enters ID in invite screen
3. **System** validates ID format and finds User A
4. **Invitation** created in `team_invitations` table
5. **User A** sees invitation in their app
6. **User A** accepts → Added to `team_members` table
7. **Both users** now belong to same team

### Error Handling:
- Invalid ID format (not 8 digits) → Rejected
- Non-existent ID → User not found error
- Already in team → Duplicate invitation prevented
- Expired invitation (7+ days) → Auto-cleanup

---

## 6. Migration Notes

### From Firebase to Supabase:
- **Auth**: Firebase Auth → Supabase Auth
- **Database**: Firestore → PostgreSQL
- **Real-time**: Firestore listeners → Supabase Realtime (future)
- **Storage**: Firebase Storage → Supabase Storage (future)
- **Functions**: Firebase Functions → Supabase Edge Functions (future)

### ID System Changes:
- **Old**: `strategoId` (10+ alphanumeric)
- **New**: `fixed_id` (exactly 8 digits numeric)
- **Benefits**: Simpler, easier to share, more memorable
