## Data model overview

This document describes the Firestore collections used by Kron0 and how they relate to the authenticated user.

### Collections

#### `todos`
- **Path**: `/todos/{todoId}`
- **Owner field**: `userId` (string, must equal `request.auth.uid`)
- **Core fields**:
  - `text`: string
  - `completed`: boolean
  - `createdAt`: number (milliseconds since epoch)

Used by `TodoContext` and related hooks for the global todo list.

#### `entries`
- **Path**: `/entries/{entryId}`
- **Owner field**: `userId` (string, must equal `request.auth.uid`)
- **Core fields**:
  - `day`: string
  - `startTime`: string
  - `endTime`: string
  - `title`: string
  - `location?`: string (optional)

Used by `TimetableContext` and UI components for the weekly schedule.

#### `focus_history`
- **Path**: `/focus_history/{sessionId}`
- **Owner field**: `userId` (string, must equal `request.auth.uid`)
- **Core fields**:
  - `startTime`: number (milliseconds since epoch)
  - `duration`: number (minutes)
  - `completed`: boolean

Used by `FocusContext` for focus session history and productivity stats.

### Access patterns

- All queries use a `where('userId', '==', user.uid)` constraint to scope data to the current user.
- Real-time listeners are set up through `listenToUserCollection` in `src/lib/firestore.ts` for:
  - `todos` (todo list)
  - `entries` (timetable)
  - `focus_history` (focus session history)

### Security rules summary

Defined in `firestore.rules`:

- All collections are **denied by default**.
- For `todos`, `entries`, and `focus_history`:
  - **Create**: requires `request.auth != null` and `request.resource.data.userId == request.auth.uid`.
  - **Read/Update/Delete**: requires `request.auth != null` and `resource.data.userId == request.auth.uid`.

This ensures users can only read and modify their own documents.

