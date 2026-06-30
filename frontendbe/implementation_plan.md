# Supabase Full Integration Plan

## Goal
Migrate the mock-driven app to a fully data-persisted application using Supabase.

## Architecture
- **Auth**: replace mock `AuthContext` with Supabase Auth (Session management, Login, Register).
- **Database**: `SupabaseService` class to handle all data operations.
- **Storage**: Upload images to Supabase Storage buckets.
- **RLS**: Validation that users only access their own data.

## Step-by-Step Implementation

### 1. Core Setup
- [ ] Verify `src/lib/supabase.ts` configuration.
- [ ] Create `src/services/SupabaseService.ts` to centralize all DB interaction.
- [ ] Update `src/helpers/AuthContext.tsx` to use `supabase.auth`.

### 2. Feature Migration (Screens)

#### A. Auth Flow
- **LoginScreen**: `supabase.auth.signInWithPassword`.
- **RegisterScreen**: `supabase.auth.signUp` (Check profile creation trigger).

#### B. Dashboard & Profile
- **Home/Dashboard**: Fetch `profiles` payload for greetings.
- **ProfileScreen**: Read/Update `profiles` table.
- **EditProfileScreen**: Update `full_name`, `phone` in `profiles` / `auth.users`.

#### C. Settings Sync
- **SettingsScreen**: Load/Save `theme`, `notifications_enabled` to `user_settings`.
- **Strategy**: On app launch, fetch settings and apply to `ThemeContext`.

#### D. Scanning & History
- **ScanScreen**:
    1. Upload image to `scans` bucket.
    2. Insert row to `scans` table.
    3. Generate/Insert `scan_results`.
- **HistoryScreen**: `select * from scans` (paginated).

#### E. Support & Feedback
- **ContactSupport**: Insert into `support_tickets`.
- **HelpCenter**: (Optional) Fetch articles if we move them to DB, else keep local for now as per user prompt "decide where data stored" -> Help Cache is Local.

### 3. Storage Integration
- Create helper `uploadImage(uri, bucket)` in `SupabaseService`.

## Verification
- Login with real email.
- Check Supabase Dashboard for new user rows.
- Scan item -> Check `scans` table.
- Update Settings -> Reload app -> Check persistence.
