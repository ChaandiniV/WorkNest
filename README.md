# WorkNest — Corporate Service Management Platform

## Overview
WorkNest is a production-style internal corporate service portal designed for enterprise employee service systems. The project demonstrates end-to-end frontend engineering using React, TypeScript, Redux Toolkit, Vite, Tailwind CSS, and modern developer workflows.

## Problem Statement
Many companies need a polished internal service portal where employees can raise requests, managers can monitor departmental performance, and admins can manage workflows, analytics, and SLA compliance. WorkNest solves this challenge with role-based experiences, mock backend persistence, and a developer console built for rapid maintenance.

## Key Features
- Role-based dashboards for Employee, Admin, and Manager
- Demo login for Employee, Admin, and Manager users
- Request listing, filtering, and detail workflows
- New service request form with React Hook Form and Zod validation
- Mock localStorage-backed API service layer with seed data
- Admin management pages for request operations and team workload
- Analytics dashboard with Recharts visualizations
- Manager overview with CSV export
- Developer console for Redux state, UI actions, and mock API health
- Theme toggle, notification preferences, and profile settings
- Error boundary, loading states, empty states, and responsive layout

## User Roles
- **Employee**: Create and track service requests, view SLA status, and review request details.
- **Admin**: Manage all requests, assign tickets, escalate issues, mark items as resolved, and review analytics.
- **Manager**: Monitor department KPIs, SLA breach rates, average resolution time, and repeated issue categories.

## Tech Stack
- React
- TypeScript
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- React Hook Form
- Zod
- Recharts
- Lucide React
- Date-fns
- Vitest
- React Testing Library
- ESLint
- Prettier

## Architecture
The application is structured with feature-driven modules under `src/features`, reusable UI components under `src/components`, typed models under `src/types`, and service abstractions under `src/services`. Routing is handled through `src/routes`, and state is centralized in `src/app/store.ts`.

## Folder Structure
```
src/
  app/
    store.ts
    hooks.ts
  assets/
  components/
    common/
    layout/
    forms/
    tables/
    charts/
    feedback/
  features/
    auth/
    requests/
    dashboard/
    admin/
    analytics/
    devConsole/
    settings/
  pages/
  routes/
  services/
  types/
  utils/
  test/
  App.tsx
  main.tsx
  index.css
```

## Screenshots
- Dashboard view
- Request listing and detail pages
- Admin analytics and team workload
- Developer console
- Settings and dark mode

## Frontend Engineering Highlights
- Comprehensive role-based routing and protected routes
- Centralized Redux Toolkit state and feature slices
- LocalStorage-backed mock data with persistence and API delay simulation
- Clean, responsive enterprise-style UI with Tailwind CSS
- Form validation using React Hook Form and Zod
- Analytics visualizations with Recharts
- Developer console for runtime insights and debugging
- Error boundary and robust UI feedback patterns

## Developer Console
The developer console page exposes real-time frontend state, recent UI actions, mock API latency, failed calls, validation errors, feature flags, and localStorage database status. It is designed to make the app maintainable and observable during development.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app at `http://localhost:4173`.

## Test Instructions
Run unit tests with:
```bash
npm run test
```

## GitHub Repository
This project is already configured as a GitHub repository at:

- `https://github.com/ChaandiniV/WorkNest`

If you want to push local changes, use:
```bash
git add .
git commit -m "Add Render deployment config and docs"
git push origin main
```

## Render Deployment
WorkNest can be deployed on Render as a static site. Render will build the app and publish the Vite `dist` output.

1. In Render, create a new static site.
2. Connect the GitHub repository: `https://github.com/ChaandiniV/WorkNest`
3. Set the branch to `main`.
4. Use the build command:
```bash
npm install && npm run build
```
5. Set the publish directory to:
```bash
dist
```

A `render.yaml` file is included to support automatic Render configuration.

## Resume Bullet Section
WorkNest — Corporate Service Management Platform
- Built a production-style internal corporate service portal using React, TypeScript, Redux Toolkit, Vite, and Tailwind CSS.
- Developed employee, admin, and manager dashboards for service request creation, assignment, SLA tracking, analytics, and resolution workflows.
- Implemented role-based routing, reusable UI components, localStorage-backed mock APIs, form validation, CSV export, and audit logs.
- Created a frontend developer console to monitor UI actions, mock API latency, Redux state, validation errors, and feature flags.
- Added unit tests, responsive layouts, loading states, error boundaries, and CI checks to follow professional frontend engineering practices.

## Future Improvements
- Add agent management and chat-style comments.
- Integrate a real backend API and authentication service.
- Add pagination, sorting, and export features for admin reports.
- Add live notifications and comments streaming.
