# Airtable Clone 🚀

A high-performance, pixel-perfect clone of Airtable built with the modern **T3 Stack** (Next.js 16, Prisma, tRPC) and **Neon Serverless Postgres**.

## ✨ Features

- **⚡ Performance First**: Optimized with **Neon Connection Pooling** and **Prisma Nested Writes** for instant base and table creation (<10ms latency).
- **🔒 Secure Authentication**: Robust auth flow using **NextAuth.js (Google Provider)** with strict server-side session enforcement and "Auth-First" routing.
- **🖼️ Virtualized Grid**: Handles thousands of rows smoothly using `@tanstack/react-virtual`.
- **🎨 Premium UI**: Replicates Airtable's exact design system using **TailwindCSS** and **shadcn/ui**.
- **🛠️ Type-Safe**: Full end-to-end type safety with **tRPC** and **Zod**.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript / React 19
- **Database**: Neon (Serverless Postgres)
- **ORM**: Prisma (with Connection Pooling)
- **Auth**: NextAuth.js v4 (Google Provider)
- **Styling**: TailwindCSS
- **State/Query**: TanStack Query & tRPC

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AdiBoi007/airtable.git
cd airtable
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-pooler...aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@ep-direct...aws.neon.tech/neondb?sslmode=require"

# Auth (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-string"
```

### 4. Initialize Database
```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`.

## 📦 Deployment (Vercel)

1.  **Environment Variables**: Add all `.env` variables to Vercel.
    *   **Important**: Use the **Pooled Connection String** for `DATABASE_URL`.
2.  **Build Command**: Override to ensure migrations run:
    ```bash
    npx prisma migrate deploy && next build
    ```
3.  **Caching Fix**: The Dashboard is configured with `export const dynamic = "force-dynamic"` to prevent stale user sessions at the Edge.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
