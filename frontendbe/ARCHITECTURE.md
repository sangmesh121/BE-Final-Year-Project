# Product Verification App - Architecture & Design

## 1. App Structure & Navigation Flow

The app will use a "Auth flow" + "Main App" structure.

### Navigation Hierarchy
- **RootNavigator** (Switch between Auth and Main)
  - **AuthStack** (Stack Navigator)
    - `LoginScreen`
    - `RegisterScreen`
    - `ForgotPasswordScreen`
  - **MainNavigator** (Bottom Tab Navigator)
    - **HomeTab**
      - `DashboardScreen` (Home)
    - **ScanTab**
      - `ScanScreen` (Camera/Upload/URL)
    - **HistoryTab**
      - `HistoryScreen`
    - **ProfileTab**
      - `ProfileScreen`
      - `SettingsScreen` (Nested in Stack)
  - **ProductStack** (Modal/Stack for details - Accessible from any tab)
    - `ProductDetailsScreen`
    - `WebResultScreen`
    - `SubscriptionScreen`

## 2. Component Hierarchy

- `src`
  - `components`
    - `common` (Button, Input, Card, Modal, Loader)
    - `product` (ProductCard, ScanView, AuthenticityBadge, PriceComparisonList)
    - `dashboard` (RecentActivity, QuickActions, InsightsCarousel)
    - `layout` (Container, Header, TabBarIcon)
  - `screens`
    - `auth` (Login, Register, ForgotPassword)
    - `dashboard` (Home)
    - `scan` (Camera, ImageUpload, UrlInput)
    - `product` (Details, Compare)
    - `history` (List, Filter)
    - `profile` (EditProfile, Subscription, Settings)

## 3. Database Schema (Supabase)

The following tables will be required in Supabase.

### `profiles`
Extends the default `auth.users` table.
- `id`: uuid (PK, references auth.users)
- `full_name`: text
- `avatar_url`: text
- `subscription_tier`: text ('free', 'pro', 'enterprise')
- `created_at`: timestamp

### `products` (Global Product Database)
- `id`: uuid (PK)
- `barcode`: text (unique)
- `name`: text
- `brand`: text
- `description`: text
- `image_url`: text
- `authenticity_status`: text ('verified', 'unverified', 'counterfeit')
- `created_at`: timestamp

### `scans` (User History)
- `id`: uuid (PK)
- `user_id`: uuid (FK -> profiles.id)
- `product_id`: uuid (FK -> products.id, nullable if unidentified)
- `scan_type`: text ('camera', 'upload', 'url')
- `scanned_value`: text (barcode, url, or raw text)
- `result_json`: jsonb (snapshot of result)
- `created_at`: timestamp

### `subscriptions`
- `id`: uuid (PK)
- `user_id`: uuid (FK -> profiles.id)
- `plan_id`: text
- `status`: text ('active', 'canceled', 'expired')
- `current_period_end`: timestamp

## 4. Technical Stack & Dependencies

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Auth & Backend**: Supabase
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Context (AuthContext) + Local State
- **UI Library**: Custom (Stylesheet) or React Native Paper
- **Camera**: `expo-camera`
- **Image Picker**: `expo-image-picker`
- **Web**: `react-native-web`

## 5. Subscription Logic
- **Free**: limited scans/day, basic details.
- **Paid**: unlimited scans, advanced price comparison, authenticity guarantee.
- Logic: Check `profiles.subscription_tier` before performing actions.
