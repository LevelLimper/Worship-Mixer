# Worship Mixer App

## Overview

Worship Mixer is a real-time in-ear monitor mix request system designed for worship teams. Musicians and singers can submit mix adjustment requests during live services or rehearsals, which are instantly transmitted to the audio engineer's view via WebSocket connections. The application prioritizes speed, clarity, and touch-friendly interactions for use in performance environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight alternative to React Router. The application has four main routes:
- `/` - Name entry page where musicians identify themselves
- `/request` - Grid selection page for choosing instruments or singers
- `/adjust` - Adjustment screen for specifying volume changes
- `/mixer` - Engineer's dashboard showing all incoming requests in real-time

**State Management**: 
- Session-based state using browser `sessionStorage` for user identification and current selection context
- Real-time data managed through React Query for server state synchronization
- WebSocket hook (`use-websocket`) for live updates without polling

**UI Component Library**: Radix UI primitives with shadcn/ui styling, following Material Design principles with a utility-focused approach. The design emphasizes large touch targets, maximum legibility, and minimal cognitive load for performers.

**Styling**: Tailwind CSS with custom design tokens defined in `tailwind.config.ts`. Typography uses Roboto font family loaded from Google Fonts CDN. The color system uses CSS custom properties for theming with HSL values.

**Design Philosophy**: Mobile-first responsive design with full viewport layouts. No constrained containers to maximize usability on tablets and phones during live performances. Component sizing prioritizes accessibility with large interactive elements (h-14 for inputs/buttons on critical screens).

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful endpoints under `/api` prefix for:
- Creating mix requests (`POST /api/mix-requests`)
- Retrieving all requests (`GET /api/mix-requests`)
- Clearing requests (`DELETE /api/mix-requests`)

**Real-Time Communication**: WebSocket server mounted at `/ws` path using the `ws` library. The server broadcasts mix request updates to all connected clients in real-time. Serialization handles Date objects by converting to ISO strings for consistent client-side parsing.

**Data Validation**: Zod schemas defined in `shared/schema.ts` for type-safe validation of:
- Mix request data (requester name, item type, item name, adjustment value)
- WebSocket message payloads (initial state, new requests, clear events)
- Adjustment constraints (integer values between -12 and +12, excluding zero)

**Session Management**: Uses `express-session` with `connect-pg-simple` for PostgreSQL-backed session storage, though the current implementation primarily relies on in-memory or database storage.

### Data Storage

**ORM**: Drizzle ORM for type-safe database interactions with PostgreSQL.

**Database Provider**: Configured for Neon serverless PostgreSQL via `@neondatabase/serverless` driver.

**Schema Design** (defined in `shared/schema.ts`):
- `users` table: Stores user credentials (id, username, password) - currently defined but not actively used in authentication flow
- `mix_requests` table: Core data model storing volume adjustment requests with fields for requester name, item type (instrument/singer), item name, adjustment value (-12 to +12), and timestamp

**Storage Abstraction**: `IStorage` interface in `server/storage.ts` allows swapping between in-memory and database implementations. The `MemStorage` class provides a Map-based in-memory storage for development/testing.

**Migration Management**: Drizzle Kit configured to generate migrations in `./migrations` directory, with schema source at `./shared/schema.ts`.

### Authentication and Authorization

Currently, the application does not implement authentication. The user schema exists in the database but is not utilized. Musicians identify themselves by entering their name on the landing page, stored in session storage. There is no password protection or role-based access control.

**Rationale**: The application is designed for closed worship team environments where trust is assumed. Future iterations may add basic authentication if deployed in more public contexts.

### External Dependencies

**Third-Party UI Libraries**:
- Radix UI: Comprehensive set of unstyled, accessible React components
- Lucide React: Icon library for consistent iconography
- shadcn/ui: Pre-built component patterns built on Radix UI
- Embla Carousel: Carousel/slider functionality (included but may not be actively used)

**State and Data Management**:
- TanStack React Query: Server state synchronization and caching
- React Hook Form: Form state management with Zod resolver integration
- Wouter: Lightweight client-side routing

**Styling and Design**:
- Tailwind CSS: Utility-first CSS framework
- class-variance-authority: Variant-based component styling
- tailwind-merge: Utility for merging Tailwind class names
- clsx: Conditional className utility

**Backend Services**:
- WebSocket (ws): Real-time bidirectional communication
- Neon Serverless: PostgreSQL database hosting
- Drizzle ORM: Database query builder and migration tool

**Development Tools**:
- Vite: Frontend build tool and dev server
- TypeScript: Type safety across the stack
- ESBuild: Server-side bundling for production
- TSX: TypeScript execution for development

**Fonts**: Google Fonts CDN for Roboto font family (weights 400, 500, 700).

**Replit-Specific Integrations**: Development environment includes Replit-specific Vite plugins for runtime error overlay, cartographer (code intelligence), and dev banner when running in Replit environment.