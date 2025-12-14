# Supabase Setup Guide

## 1. Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` which was added to `package.json`.

## 2. Set Up Environment Variables

Add to `.env.local`:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create the Database Table

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query

This will create:
- `maps` table with all required columns
- Indexes on `session_id` and `created_at`
- Auto-update trigger for `updated_at` timestamp
- RLS disabled (as requested for MVP)

## 4. API Endpoints

### POST /api/maps
Save a new map
- **Input**: `{ query: string, results: object }`
- **Output**: `{ mapId: string, createdAt: string }`
- **Auth**: Requires session cookie

### GET /api/maps
List all maps for current session
- **Output**: Array of `{ id, query, created_at, updated_at, metadata }`
- **Auth**: Uses session cookie

### GET /api/maps?id=xxx
Get a specific map by ID
- **Output**: `{ id, query, results, createdAt, updatedAt }`
- **Auth**: Verifies session matches

### GET /api/maps/[id]
Get a specific map (alternative route)
- **Output**: Same as above

### DELETE /api/maps/[id]
Delete a map
- **Auth**: Verifies session matches before deletion

## 5. Frontend Components

### SaveMapButton
- Located in `components/SaveMapButton.tsx`
- Added to search results page
- Shows save confirmation with map ID
- Handles errors gracefully

### My Saved Maps Page
- Located at `/maps`
- Lists all saved maps for current session
- Shows: query, date, metadata (company/industry/signal counts)
- Actions: Reload (navigate to search) and Delete

## 6. Session Management

- Session ID stored in HTTP-only cookie (`session_id`)
- Auto-generated on first visit
- Persists for 1 year
- Used for all API authentication
- Client-side helper: `lib/session-client.ts`
- Server-side helper: `lib/session.ts`

## 7. Usage Flow

1. User performs search → Results displayed
2. User clicks "Save this map" → Map saved to Supabase
3. User navigates to `/maps` → Sees all saved maps
4. User clicks "Reload" on a map → Navigates to `/search?q=...` with saved query
5. User can delete maps they no longer need

## Security Notes

- Session verification on all map operations
- Users can only access/delete their own maps (by session_id)
- RLS disabled for MVP (backend filtering handles security)
- HTTP-only cookies prevent XSS attacks

