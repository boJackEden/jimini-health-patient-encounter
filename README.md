# Jimini Health Patient Encounter

A React Native take-home assignment demonstrating a patient encounter list with API integration.

## Setup & Running

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
npm run start
```
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan the QR code with the Expo Go app on your phone

### Run Tests
```bash
npm test
```

## Tech Stack Choices

**Platform**: React Native with Expo. Expo simplifies the build process and lets reviewers run the app easily via Expo Go without needing Xcode/Android Studio fully configured.

**Key Libraries**:
- **TanStack Query (React Query)**: Handles caching, background refetching, and pagination out of the box. Redux felt like overkill since we're mostly just displaying server data.
- **Expo Router**: File-based routing that mirrors Next.js patterns. Makes navigation predictable and easy to follow.

**State Management**: TanStack Query for server state, React Context for the small amount of client state (like the offline mode toggle).

## Design Decisions

**Architecture**: The API service layer (`services/api.ts`) is completely separate from React. This makes it testable in isolation and easy to swap out the mock implementation for a real API later.

**Offline Mode Simulator**: I added an offline mode toggle in Settings to make it easy to test error handling. When enabled, API calls fail immediately and the app shows either a full error screen (if there's no cached data) or a dismissible banner at the bottom (if we can still show stale data). I thought this was the clearest way to demonstrate graceful degradation without needing to actually disconnect from the network.

**Trade-offs**:
- Used a mock API instead of a real backend to keep the assignment self-contained
- Chose infinite scroll over traditional pagination for better mobile UX
- Kept the component structure flat rather than over-abstracting for a small app

**For Production I'd Add**:
- Filtering & sorting UI (the data layer already supports it)
- Real API integration with proper auth
- More comprehensive error boundaries
- Analytics/crash reporting

## PHI/PII Handling

**UI Protection**: Only patient initials are shown in the UI, never full names or patient IDs. Clinical notes are only visible in the detail view, not in list cards.

**Logging Strategy**: The logger utility automatically strips sensitive fields like `patientId`, `notes`, `assessments`, and anything with "patient" in the key name. This way we can still debug API calls and errors without accidentally leaking PHI to the console. It's a simple allowlist approach - log the metadata, redact the clinical data.

**Security Considerations**: In production, I'd add encryption at rest for any cached data, ensure HTTPS for all API calls, and implement proper session management with token refresh.

## Testing Philosophy

See [TESTING.md](./TESTING.md) for detailed documentation on what I tested, why, and how I made the codebase testable.

**Run tests**: `npm test`

**What I'd Add With More Time**:
- Integration tests that verify the full flow from API call through to rendered UI
- Accessibility testing for screen readers and touch targets
- E2E tests with Detox for critical user journeys
- Container/presenter pattern for screens - separate navigation logic from the UI so the presentational component just receives props, making it testable without mocking Expo Router

## Time Breakdown

**Hour 1**: Built out the data layer and got the app running from the Expo boilerplate. This included the mock API, pagination logic, and basic list/detail screens.

**Hour 2**: Focused on testing and polish. Wrote unit tests for the critical paths (PHI redaction, component rendering, API behavior), implemented the offline mode simulator, and documented the state management approach in the README. I considered adding Zustand or Redux but decided React Query already handled everything I needed - no point adding complexity.

**~30 min**: Tested on both iOS and Android simulators, recorded the demo videos, and did a final pass through the instructions to make sure I hadn't missed anything.

## Screen Recordings

### iOS (iPhone 14 Pro)

https://github.com/user-attachments/assets/8b5a0833-4f4e-49f2-b6f7-cee789a2c33b

### Android (Pixel 7)

https://github.com/user-attachments/assets/3ee88d90-5b99-4517-ba7a-cd4f1972b6e8
