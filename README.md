# Cube Tutor

A web application for learning Rubik's cube solving methods and speedsolving algorithms.

## Project Overview

Cube Tutor helps users learn various Rubik's cube solving methods, starting with the Beginner's method and CFOP (Fridrich method). The MVP focuses on a text-based interface with algorithm practice and case recognition.

### Development Phases

- **MVP (Current)**: Text-based interface, Beginner + CFOP methods
- **V1**: 3D visualization, interactive cube manipulation
- **V2**: User accounts, progress tracking, custom training
- **V3**: Mobile apps (iOS/Android)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites

- Bun (v1.0 or higher)
- Node.js 20+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cube-tutor

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start development server
bun dev

# Run tests
bun test

# Run tests with UI
bun test:ui

# Run linter
bun run lint

# Build for production
bun run build

# Start production server
bun start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
cube-tutor/
├── app/                      # Next.js app directory (pages, layouts)
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── cube/            # Cube-specific components
│   │   ├── navigation/      # Navigation components
│   │   └── layout/          # Layout components
│   ├── lib/
│   │   ├── cube-engine/     # Cube state & move execution
│   │   ├── data-loader/     # Algorithm data loading
│   │   └── utils/           # Utility functions
│   ├── data/
│   │   ├── puzzles/         # Puzzle definitions
│   │   ├── methods/         # Method descriptions
│   │   └── algorithms/      # Algorithm JSON files
│   │       ├── beginner/
│   │       └── cfop/
│   │           ├── oll/
│   │           └── pll/
│   └── types/               # TypeScript type definitions
├── .opencode/
│   └── plan/                # Project planning documents
└── tests/                   # Test files
```

## Supported Methods

### MVP Phase
- **Beginner's Method**: 7 steps, 9 algorithms ✅
- **CFOP**: 
  - OLL: All 57 cases ✅ (Completed 2026-01-05)
  - PLL: All 21 cases ✅

### Future Phases
- F2L (41 cases)
- Roux method
- ZZ method

## Data Sources

Algorithms are collected from:
- [SpeedCubeDB](https://speedcubedb.com) - OLL/PLL algorithms
- [JPerm.net](https://jperm.net) - Beginner's method

## Contributing

This is a personal project. Contributions are welcome after the MVP is complete.

## License

TBD

## Roadmap

See `.opencode/plan/implementation-plan.md` for detailed task breakdown and timeline.

### Current Status: MVP Development - ~75% Complete

**Phase 0 - Project Setup:** ✅ Complete
- [x] Initialize Next.js project
- [x] Set up directory structure
- [x] Configure Tailwind CSS
- [x] Install shadcn/ui
- [x] Configure ESLint
- [x] Set up Vitest
- [x] Create TypeScript types
- [x] Environment variables
- [x] README

**Phase 1 - Cube Engine:** ✅ 95% Complete (98 tests passing)
- [x] Move parser with WCA notation support
- [x] Cube state management
- [x] Move executor (all 6 faces)
- [x] Algorithm validator
- [x] Comprehensive unit tests
- [ ] Face renderer (deferred to V1 - not needed for text MVP)

**Phase 2 - Data Collection:** ✅ 100% Complete
- [x] Beginner method: 9 algorithms ✅
- [x] CFOP PLL: 21 cases ✅
- [x] CFOP OLL: All 57 cases ✅ (Completed 2026-01-05)
- **All algorithm data complete!**

**Phase 3 - UI Components:** ✅ 90% Complete
- [x] Layout components (Header, Footer, Container, PageHeader)
- [x] Navigation components (Breadcrumbs, Cards)
- [x] Cube display components (CaseCard, AlgorithmNotation)
- [ ] Error boundaries and loading states

**Phase 4 - Pages & Routing:** ✅ 85% Complete
- [x] All main pages (Home, Puzzles, Methods, Stages, Cases)
- [x] Dynamic routing working
- [x] Build succeeds
- [ ] SEO metadata, 404 page, sitemap

**Phase 5 - Testing & Polish:** ❌ 15% Complete
- [x] Unit tests (98 passing)
- [ ] E2E testing with Playwright
- [ ] Performance optimization
- [ ] Accessibility audit

**Phase 6 - Deployment:** ❌ Not started

### Time to MVP: 24-38 hours remaining

### Next: Phase 3 - Polish UI Components & Error Handling

Building the core cube state management and WCA notation parser.
