# Waypoint

A travel planner for finding places to visit and putting together your next trip.

Waypoint brings destination discovery and trip planning into one place. Browse destinations, create trips, and organize activities into an itinerary without juggling multiple notes and lists.

## Features

- **Discover destinations** — Browse places and explore destination details.
- **Plan trips** — Create and manage your trips.
- **Build an itinerary** — Organize activities around your travel plans.
- **Edit as you go** — Add activities and update your plans as they change.
- **Responsive design** — Use the app on desktop or mobile.
- **No API key required for the base version** — Get started without configuring an external service.

## Built with

- Next.js
- React
- TypeScript
- Tailwind CSS

## Getting started

You'll need [Node.js](https://nodejs.org/) and npm installed.

Clone the repository and move into the project directory:

```bash
git clone https://github.com/jashwanth0607/waypoint.git
cd waypoint
```

Install the dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

The project includes an `.env.example` file. The base version doesn't require secret API keys.

If you need to configure the app URL, set `NEXT_PUBLIC_APP_URL` in your local environment file. Use the URL for your local development server or deployed application, as appropriate.

Never put private API keys or credentials in files committed to GitHub.

## Production build

To check the production build locally:

```bash
npm run build
npm start
```

Run `npm start` after the build completes.

## Deployment

Waypoint includes a `render.yaml` configuration for Render.

To deploy, connect the repository to Render as a **Web Service**, using the Node runtime. Check the configuration file and the service's build and start commands before deploying.

Set the production app URL in the Render environment settings once your deployment URL is available.

## Project structure

```text
src/
├── app/
│   ├── destinations/
│   ├── trips/
│   ├── privacy-policy/
│   ├── terms-and-conditions/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── destinations/
│   ├── home/
│   ├── navigation/
│   ├── trips/
│   ├── footer/
│   └── ui/
└── lib/
    ├── data.ts
    ├── storage.ts
    ├── types.ts
    └── utils.ts
```

## License

No license has been specified yet. All rights are reserved by default unless a license is added to the repository.
