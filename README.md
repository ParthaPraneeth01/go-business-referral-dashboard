# Go Business Referral Dashboard

A referral management dashboard built for Go Business. Users log in, view referral metrics, share their referral link/code, and browse a searchable, sortable, paginated table of referrals with a detail view per referral.

## Tech Stack

- React (Vite)
- React Router
- Axios
- js-cookie

## Features

- Email/password login with JWT stored in a cookie
- Protected routes (dashboard and referral detail require login)
- Overview metrics, service summary, and referral link/code sharing
- Searchable and sortable referrals table with client-side pagination (10 rows per page)
- Referral detail page
- 404 page for unmatched routes

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Test Credentials

```
Email: admin@example.com
Password: admin123
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
  main.jsx
  App.jsx
  App.css
  components/
    ProtectedRoute.jsx
    Navbar.jsx
    Footer.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    ReferralDetail.jsx
    NotFound.jsx
  utils/
    api.js
    format.js
```
