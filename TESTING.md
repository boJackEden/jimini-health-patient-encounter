# Testing Strategy

## What I Tested

**1. PHI Redaction in Logger** (`__tests__/utils/logger.test.ts`)
This is the most critical test in the app. If the logger leaks patient data, we have a HIPAA violation. The tests verify that `patientId`, `notes`, `assessments`, SSN, email, phone, and date of birth are all redacted from log output, while safe fields like `encounterType` and `status` pass through. Also tests nested objects and arrays to ensure deep redaction.

**2. EncounterCard PHI Protection** (`__tests__/components/EncounterCard.test.tsx`)
Validates that the card only displays safe data (initials, date, type, status) and never renders `patientId` or `notes` to the screen. Also covers the tap interaction and all status/type label mappings.

**3. API Pagination & Error Handling** (`__tests__/services/api.test.ts`)
Tests the full pagination flow (page boundaries, `hasMore` flag, different page sizes) and error scenarios (404 for missing encounters, network failure simulation). This is critical because bad pagination means users can't see their data, and poor error handling means a confusing UX.

## What I'd Test With More Time (Prioritized)

1. **Integration tests for encounters list** - Load the list, scroll to trigger pagination, tap a card to navigate, verify detail screen shows correct data. Would use React Native Testing Library with a mock API server.
2. **Offline banner behavior** - Test that cached data shows with a banner when offline, and that the banner dismisses correctly.
3. **Pull-to-refresh flow** - Verify that refreshing clears error state and shows updated data.
4. **Accessibility** - Screen reader labels, touch target sizes, color contrast ratios.
5. **Container/presenter pattern for screens** - Separate navigation logic from UI so screen components receive data as props. This would let me test screen rendering without mocking Expo Router.

## How I Made This Testable

- **Separated data fetching from UI**: The API service (`services/api.ts`) is a standalone module with no React dependencies. It can be tested in isolation without rendering any components.
- **Configurable mock API**: The `configureApi()` function lets tests set `baseDelay: 0` for fast execution and `failureRate: 1` to simulate errors deterministically.
- **Small, focused components**: `EncounterCard` takes an `Encounter` object and an `onPress` callback - easy to test with any fixture data.
- **Dependency injection for hooks**: Components use custom hooks (`useEncounter`, `useEncountersInfinite`) which wrap React Query. This makes it easy to mock the data layer without touching the component logic.
