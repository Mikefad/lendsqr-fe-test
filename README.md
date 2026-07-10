# Lendsqr Frontend Assessment

A responsive implementation of the Lendsqr administration interface built with React, TypeScript, Vite, and modular SCSS.

## Links

- Deployment: `https://your-name-lendsqr-fe-test.vercel.app`
- Repository: `https://github.com/your-username/lendsqr-fe-test`

Replace these placeholders after deploying and publishing the repository.

## Features

- Responsive login, dashboard, users, filter panel, and user-details screens
- Local mock authentication with protected routes
- Async mock API containing 500 deterministic user records
- Search, six-field filtering, page-size selection, and pagination
- Loading, error, empty, and missing-user states
- Selected-user persistence across page refreshes
- Reusable SVG icon and image assets
- Vitest and React Testing Library coverage for critical flows

## Setup

Prerequisites:

- Node.js 20 or later
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Run the test suite:

```bash
npm test
```

## Authentication

Authentication is intentionally local because the assessment does not require a backend.

The login form accepts any valid email address and any password containing at least six characters. A successful login stores a small session object under `lendsqr-session` in `localStorage`.

Demo credentials for reviewers:

```text
Email: admin@lendsqr.com
Password: password123
```

These are not hardcoded credentials. They are documented examples that satisfy the local validation rules.

`ProtectedRoute` guards `/dashboard`, `/users`, and `/users/:userId`. Unauthenticated visitors are redirected to `/login`. Logout removes the session and redirects back to login.

No password is persisted.

## Mock API and data generation

The application fetches users asynchronously from:

```text
/mock/users.json
```

The dataset contains 500 deterministic, realistic user records. It is committed at `public/mock/users.json` so it behaves like a static API endpoint in development and production.

Regenerate the file with:

```bash
npm run generate:users
```

The generator lives in `scripts/generate-users.mjs`. It produces stable IDs and profile, employment, banking, social, loan, savings, status, and guarantor data.

`src/services/usersApi.ts` owns the request and validation boundary. It includes a short artificial delay so the loading UI is visible during development and supports `AbortSignal` to avoid updating an unmounted page.

## Architecture

```text
src/
├── assets/
│   ├── icons/          Reusable SVG interface icons
│   └── images/         Logo and login illustration
├── components/         Shared navigation, tables, cards, and route guards
├── context/            Authentication state
├── pages/              Login, users dashboard, and user details
├── services/           Auth, mock API, and localStorage boundaries
├── styles/             Page-level modular SCSS
├── test/               Test setup and application tests
└── types/              Shared TypeScript domain models
```

The UI components do not fetch or persist data directly except at explicit interaction boundaries. The Users page owns request and query state, while services own external storage and network access.

## Search, filtering, and pagination

The mock dataset is fetched once. Search and filters are computed with `useMemo`, and only the current page is passed to the table.

Search checks:

- Username
- Email
- Phone number
- Organization

The filter form checks:

- Organization
- Username
- Email
- Date joined
- Phone number
- Status

Changing search, filters, or page size returns the view to page one. Page sizes of 10, 20, 50, and 100 are supported.

Client-side pagination is appropriate for this static 500-record assessment dataset. A production API with a substantially larger dataset should perform filtering and pagination server-side.

## UI states

The Users page explicitly handles:

- Loading: animated progress state during the request delay
- Success: statistics, table, filters, and pagination
- Error: request message with a Retry button
- Empty: guidance and a button to clear search and filters

The details page has a separate fallback when no selected user exists.

Unmatched protected routes render a simple 404 page with links back to Dashboard and Users.

## User-details persistence

Selecting **View Details** stores the complete user under `lendsqr-selected-user` in `localStorage` before navigating to `/users/:userId`.

The details page reads that record during initialization. Refreshing the browser therefore preserves the selected profile. Invalid or missing stored data produces a clean fallback with a link to the Users page.

If the stored user is missing or does not match the route ID, the details page fetches `/mock/users.json`, looks up the user by ID, displays the match, and writes it back to `localStorage`. If no user matches the route ID, a not-found state is shown.

## User status actions

The Users table action menu supports frontend-only status changes:

- **Blacklist User** changes that user to `Blacklisted`
- **Activate User** changes that user to `Active`

The update happens in local component state so pagination, filters, and search continue to work without a backend. The User Details action buttons update the selected profile and persist the updated user back to `localStorage`.

## Deployment

Build locally before deploying:

```bash
npm run build
```

Deploy the generated Vite app to a static hosting provider such as Vercel or Netlify. After deployment, replace the placeholder deployment and repository URLs at the top of this README.

## Testing

Vitest uses the jsdom environment and React Testing Library. The suite covers:

- Invalid login validation
- Successful login session persistence
- Protected-route redirects
- Users loading state
- Empty state after an unmatched search
- User-details fallback without a selected user

Tests mock the browser fetch boundary rather than depending on the development server.

## Styling

The project uses SCSS only—no Tailwind or CSS-in-JS. Desktop dimensions follow the supplied 1440px Figma layouts, while tablet and mobile breakpoints collapse the sidebar, stack cards, preserve accessible controls, and allow wide tables and tabs to scroll safely.
