# Jimini Health Patient Encounter

A React Native take-home assignment for Jimini Health, demonstrating a patient encounter list with API integration.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Metro bundler:
   ```bash
   npm run start
   ```

3. Run the app:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan the QR code with the Expo Go app on your phone

## Running Tests

```bash
npm test
```

## Assignment Requirements

### API Integration
- [x] GET /api/encounters with pagination support
- [x] GET /api/encounters/:id for encounter details
- [x] Mock API implementation
- [x] Abstracted API calls for testability

### UI Requirements - List Screen
- [x] Display encounters in a scrollable list
- [x] Show: patient initials, date, encounter type, status
- [x] Pull-to-refresh
- [x] Infinite scroll pagination
- [x] Empty state when no encounters
- [x] Loading states (initial load, pagination, refresh)
- [x] Error state with retry capability

### UI Requirements - Detail View
- [x] Show full encounter details including assessments
- [x] Navigate back to list
- [x] Maintain scroll position when returning to list

### Performance & Optimization
- [x] Efficient rendering with virtualization (FlatList)
- [x] Smart caching (React Query - don't refetch unnecessarily)
- [x] Network resilience with retry and error feedback

### PHI/PII Handling
- [x] Never log patient IDs or clinical notes to console
- [x] Use initials in UI, not full names
- [x] Logging utility that redacts sensitive fields

### Testing
- [x] Component rendering with data
- [x] Loading and error states
- [x] User interactions (pull-to-refresh, pagination)
- [x] Data transformation/formatting

## Explanations

### State Management Strategy

I chose **TanStack Query (React Query)** as the primary state management solution for this app. Here's why:

**Why React Query for Server State:**
- **Purpose-built for async data**: React Query handles fetching, caching, synchronizing, and updating server state out of the box
- **Smart caching**: Data remains fresh for 30 seconds (`staleTime`), preventing unnecessary refetches when navigating between screens
- **Automatic background refetching**: Stale data is shown immediately while fresh data loads in the background
- **Built-in retry logic**: Exponential backoff (1s, 2s, 4s) for failed requests with smart error handling (no retry on 4xx errors)
- **Pagination support**: `useInfiniteQuery` handles infinite scroll with cursor-based pagination seamlessly

**Why not Redux/Zustand for this app:**
- The app is primarily displaying server data (encounters list and details)
- There's minimal client-side state that needs to be shared globally
- Adding Redux would introduce unnecessary complexity and boilerplate
- React Query already provides the caching and synchronization this app needs

**Client State Approach:**
- React Context (`AppSettingsContext`) for app-wide settings (theme, debug options)
- Local component state for UI-specific state (scroll position, input values)
- This separation keeps the codebase simple and avoids over-engineering

**Future Considerations:**
- For offline-first support, React Query can be extended with `persistQueryClient` to cache data to AsyncStorage
- If the app grew to need complex client state (filters, multi-step forms), Zustand would be a lightweight addition
