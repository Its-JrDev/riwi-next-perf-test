# riwi-next-perf-test

# riwi-next-perf-test

A Next.js 16 (App Router + Turbopack) application built with feature-based.

This project is set up with Biome for code quality.

## Built With

- [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/) (Supabase PostgreSQL)
- [Lucide Icons](https://lucide.dev/)
- [Biome](https://biomejs.dev/)

## Getting Started

First, install dependencies and run the development server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start development server (Turbopack)     |
| `npm run build`       | Build for production                     |
| `npm run start`       | Start production server                  |
| `npm run db:generate` | Generate Prisma Client                   |
| `npm run db:push`     | Push schema changes directly to database |
| `npm run db:seed`     | Seed database                            |
| `npm run db:studio`   | Open Prisma Studio GUI                   |
| `npm run lint`        | Run Biome linter                         |
| `npm run typecheck`   | Type-check the project (tsc -b)          |

## Project Structure

This project is built on **Next.js 16 (App Router + Turbopack)** with React Server Components (RSC) by default.

```
src/
├── app/          # Next.js App Router (Server & Client Components)
├──     ├── (public)/    # Public route group (landing, marketing)
    ├── (auth)/      # Authentication route group (login, register)
    ├── (private)/   # Protected route group (dashboard, settings)
    ├── (admin)/     # Role-restricted route group
    ├── layout.tsx    # Root layout (Server Component)
    └── globals.css   # Tailwind CSS & global styling directives
├── proxy.ts      # Next.js 16 Edge Route Guard (Auth Proxy)
├── features/     # Feature modules (pages, hooks, api, types)
├── shared/       # Reusable, domain-agnostic resources
└──     ├── components/ # Shared UI components & primitives
    ├── hooks/      # Shared custom hooks
    ├── layouts/    # High-level layout wrappers
    ├── stores/     # Global state stores
    ├── types/      # Global TypeScript definitions
    └── utils/      # Pure utility functions
```

## Route Groups & Edge Auth Proxy

This project includes an edge route guard conforming to the **Next.js 16 Proxy specification** (`src/proxy.ts`).

- **`(public)`**: Marketing and landing pages accessible to all visitors.
- **`(auth)`**: Sign in and registration pages. Authenticated users are automatically redirected to `/dashboard`.
- **`(private)`**: Protected application routes (`/dashboard`, `/settings`) requiring session authentication.
- **`(admin)`**: Protected administration routes (`/admin`) requiring administrative role privileges.
- **Edge Route Guard (`src/proxy.ts`)**: Evaluates incoming request cookies (`auth-token`, `user-role`) before routes are rendered, routing unauthorized requests to `/login?from=...` and unauthorized admin access back to `/dashboard`.

## Authors

- **Your Name** - [@your_twitter](https://twitter.com/your_twitter) - your@email.com

See also the list of [contributors](https://github.com/your_username/riwi-next-perf-test/graphs/contributors) who participated in this project.

## License

Distributed under the MIT License. See `LICENSE` for more information.
