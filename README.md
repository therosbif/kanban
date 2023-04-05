# Kanban Board App

Deployed at [https://kanban-jack.up.railway.app](https://kanban-jack.up.railway.app)

## Description

This is a simple web application allowing the user to create Kanban boards, inspired by tools like Trello. The web app allows the user to sign in. After logging in, they can create and delete boards and for each one configure a set of columns and add cards to it. Cards have a title and a description, and it is possible to drag & drop them between columns. The state of the user’s board persists between sessions.

## Technology Stack

- [SvelteKit](https://kit.svelte.dev/) / [Svelte](https://svelte.dev/) - Application framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Auth.js](https://authjs.dev/) - Authentication library
- [Zod](https://zod.dev) - Schema validation library
- [Railway](https://railway.app/) - Deployment platform

## Installation and Usage

### Clone the repository

```bash
git clone https://github.com/therosbif/kanban
cd kanban
```

### Create a .env file in the project root directory and add the required environment variables

> a [.env.example](./.env.example) file is provided as a reference

### Local

#### Install dependencies

```bash
pnpm install
```

#### Run the following command to initialize a fresh database

```bash
pnpm prisma db push
```

#### Start the development server

```bash
npm run dev
```

> Open your web browser and navigate to [http://localhost:5173](http://localhost:5173) to use the application.

### Docker

`Dockerfile` and `docker-compose.yml` files are provided in the `docker` directory.

```bash
cp docker/* ./
cp docker/.* ./
docker-compose up
```

> Dockerfile has to be put in `docker` directory to avoid interference with Railway deployment.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run preview`: Serves the production build for preview.
- `npm run check`: Checks the project for type and lint errors.
- `npm run check:watch`: Watches the project for type and lint errors.
- `npm run lint`: Lints the project files.
- `npm run format`: Formats the project files.
- `npm run prepare`: Generates Prisma Client.

## Dependencies

The following dependencies were used in this project:

- `@auth/sveltekit`: SvelteKit adapter for authentication library.
- `prisma` `@prisma/client`: Prisma ORM for database access.
- `@steeze-ui/svelte-icon` `@steeze-ui/heroicons`: Icon library.
- `@sveltejs/adapter-node`: Svelte adapter for Node.js server.
- `@sveltejs/adapter-vercel`: Svelte adapter for Vercel platform.
- `nodemailer`: Node.js module for sending emails.
- `zod`: TypeScript-first schema validation library.

## Known Issues

- Email login is not working in production due to the fact that the SMTP server is not whitelisted.
