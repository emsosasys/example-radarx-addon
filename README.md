# classroom-addon

Google Classroom Add-on for Academic Progress and Status Reporting

## Overview

This project is a Node.js/TypeScript add-on for Google Classroom, providing academic progress and status reports for students, teachers, and administrators. It integrates with the RadarX API to fetch and display relevant data, and supports Google OAuth2 authentication.

## Features

- Google OAuth2 authentication (popup-based)
- Role-based access (student, facilitator, admin)
- Weekly and school progress reports
- Attachments for Google Classroom announcements
- Responsive UI with EJS templates and Tailwind CSS (via DaisyUI)
- Secure session management and token encryption

## Project Structure

```
.
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # HTTPS server entrypoint
│   ├── config/               # Environment, session, and constants
│   ├── controllers/          # Route controllers
│   ├── helpers/              # Utility helpers (OAuth, errors)
│   ├── middlewares/          # Express middlewares
│   ├── routes/               # Express routes
│   ├── services/             # Business logic/services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   └── views/                # EJS templates
├── public/                   # Static assets (CSS, favicon)
├── sessions/                 # Session file storage
├── build.js                  # SWC build script
├── package.json
├── tsconfig.json
├── .env.example
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- [RadarX API](https://radarx.cincinnatus.edu.do/) credentials
- Google OAuth2 credentials (Client ID, Secret, Redirect URI)
- Local SSL certificates (see below)

### Setup

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd classroom-addon
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values.

4. **Generate local SSL certificates:**

   ```sh
   ./generate-local-cert.sh
   ```

   - Follow the instructions to trust the certificate in your browser.

5. **Build the project:**

   ```sh
   pnpm run build
   # or
   npm run build
   ```

6. **Start the development server:**

   ```sh
   pnpm run dev
   # or
   npm run dev
   ```

   The server will run at [https://addon-local.dev:8081](https://addon-local.dev:8081).

## Usage

- Visit `/auth/signin` to log in with Google.
- Access reports via the navigation menu based on your role.
- Teachers and admins can create Google Classroom attachments for reports.

## Customization

- **Views:** Modify EJS templates in views
- **Styles:** Edit Tailwind/DaisyUI styles in extra.css
- **API Integration:** Update RadarX API logic in radarx.service.ts

## Security

- All sensitive tokens are encrypted using AES-256-CBC.
- Sessions are stored securely (see `src/config/session.ts`).
- Environment variables are validated with Zod.
