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
