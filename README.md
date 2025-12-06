# 🦆 DuckParty Front-end

> Build a ridiculous duck, give it style, and flex it like it owns the internet.

A modern, interactive web application for creating and customizing ducks with various skins and accessories. Join the party and see your duck alongside others in a vibrant virtual yard.

## 🔗 Back-end

This frontend connects to the DuckParty backend API. For backend setup and documentation, visit:

**[duckparty-backend](https://github.com/omidnikrah/duckparty-backend)**

## ✨ Features

- **Duck Customization** - Create unique ducks with multiple skins and accessories
- **Party Yard** - View all ducks in a shared virtual space
- **Leaderboard** - See the most popular ducks
- **User Profiles** - Manage and showcase your duck collection
- **Social Sharing** - Share your creations with the world

## 🛠️ Tech Stack

- **[SolidJS](https://www.solidjs.com/)** - Reactive UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and state management
- **[Orval](https://orval.dev/)** - API client generation

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js with pnpm)
- Backend server running (see [Backend](#-backend) section above)

### Installation

```bash
# Install dependencies
bun install

# Generate API client from backend schema
bun run generate:api

# Start development server
bun run dev
```

### Build

```bash
# Build for production
bun run build
```

## 📝 Scripts

- `dev` - Start development server
- `build` - Build for production
- `generate:api` - Generate API client from backend OpenAPI schema

---

Made with ❤️‍🔥 for the duck community
