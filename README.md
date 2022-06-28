# Overview

This project is a work in progress.

The aim has been for this portal to replace this Airtable form: https://airtable.com/shrr8CbYRDHflkgI9 which saves to https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh/viwgxFeJIGB50pkvj?blocks=hide

## Why?

- to improve student experience
- to clean up our data (normalize / deduplicate it rather than) having student profiles and program registrations merged together
- to enable better tracking across a student's whole journey (once we link our new database to other systems)
- to extricate ourselves from that Airtable table, which already has >20k rows and will max out at 50k.

## What further work is required

- finishing v1 development of the 3 main pages (logged-out index page, profile creation page, program enrollment page), making them responsive, and improving the emails
- migrating old data from Airtable to our database (including any cleanups / interpretations)
- finish tasks/issues at https://github.com/NEAR-Edu/portal/issues
- write automated tests
- replacing the existing Airtable form with a redirect to this new form

## Deployment

There are 2 branches: `develop` and `main`. Commits pushed to `main` automatically get deployed to Render.com, which is a serverless environment. Our domain name is: https://my.near.university/

# Setup

```
cp .env.local.example .env.local
npm install
```

Run these commands now and after any edits to `prisma/schema.prisma`: `npm run prismaDev` and `./node_modules/.bin/prisma generate`.

# Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

# Background info

This project uses [next-auth.js.org](https://next-auth.js.org).
