# Cube Tutor

A web application for learning Rubik's Cube solving methods and speedsolving algorithms.

## Project Overview

Cube Tutor helps users learn various Rubik's Cube solving methods, starting with the Beginner's method and CFOP (Fridrich method). The MVP focuses on a clean, text-based interface with comprehensive algorithm reference and case recognition.

### Development Phases

- **MVP (Current - 85% Complete)**: Text-based interface, Beginner + CFOP methods
- **V1 (Next)**: 3D visualization, interactive cube manipulation, algorithm animation
- **V2**: User accounts, progress tracking, custom training, practice mode
- **V3**: Mobile apps (iOS/Android), offline mode

## Features

### Current (MVP)
- ✅ Complete Beginner method with 9 algorithms
- ✅ CFOP OLL - All 57 cases with multiple algorithms
- ✅ CFOP PLL - All 21 cases with multiple algorithms
- ✅ Case recognition with descriptions and hints
- ✅ Copy-to-clipboard for algorithms
- ✅ Responsive design (mobile-first)
- ✅ Breadcrumb navigation
- ✅ Search-optimized (SEO)
- ✅ Fast performance (Lighthouse 97-100/100)
- ✅ 100% accessible (WCAG AA compliant)

### Coming in V1
- 🔜 3D cube visualization
- 🔜 Algorithm animation player
- 🔜 F2L algorithms (41 cases)
- 🔜 Algorithm search and filtering
- 🔜 Dark mode
- 🔜 Algorithm comparison tool

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + Radix UI
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Deployment**: Docker

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- Node.js 20+ (optional, for compatibility)
- Docker (optional, for E2E testing and deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/antonu17/cube-tutor.git
cd cube-tutor

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun dev

# Run unit tests (98 tests)
bun test

# Run unit tests with UI
bun test:ui

# Run E2E tests (30 tests) - requires Docker
bun run test:e2e:docker:build  # First time only
bun run test:e2e:docker

# Run linter
bun run lint

# Build for production
bun run build

# Start production server (after build)
bun start
```

The development server will be available at `http://localhost:3000`.

### Testing

**Total: 128 tests passing**
- 98 unit tests (Vitest) - Core cube engine and logic
- 30 E2E tests (Playwright) - User flows and accessibility

```bash
# Unit tests
bun test                  # Run once
bun test:ui              # Interactive UI
bun test:coverage        # With coverage report

# E2E tests (Docker recommended)
bun run test:e2e:docker           # Run in Docker
bun run test:e2e:docker:headed    # With visible browser
bun run test:e2e:docker:trace     # With trace for debugging

# E2E tests (local, if Playwright installed)
bun run test:e2e         # Headless mode
bun run test:e2e:ui      # Interactive UI
bun run test:e2e:debug   # Debug mode
```

## Project Structure

```
cube-tutor/
├── app/                         # Next.js 15 App Router
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # About page
│   ├── puzzles/                # Dynamic routes
│   │   └── [puzzle]/
│   │       └── [method]/
│   │           └── [stage]/
│   │               ├── page.tsx         # Stage/case browser
│   │               └── [case]/page.tsx  # Case detail
│   ├── error.tsx               # Error boundary
│   ├── global-error.tsx        # Global error handler
│   └── not-found.tsx           # 404 page
├── src/
│   ├── components/             # React components (27 total)
│   │   ├── ui/                # shadcn/ui base components (11)
│   │   ├── cube/              # Cube-specific components (8)
│   │   ├── navigation/        # Navigation components (4)
│   │   └── layout/            # Layout components (4)
│   ├── lib/
│   │   ├── cube-engine/       # Algorithm parser & executor (98 tests)
│   │   ├── data-loader/       # JSON data loading
│   │   └── utils/             # Utility functions
│   ├── data/                  # Static JSON data
│   │   ├── puzzles/           # Puzzle definitions
│   │   ├── methods/           # Method metadata
│   │   └── algorithms/        # Algorithm cases
│   │       ├── beginner/      # 9 algorithms
│   │       └── cfop/          # 78 algorithms (OLL + PLL)
│   └── types/                 # TypeScript type definitions
├── e2e/                       # Playwright E2E tests (30 tests)
├── .opencode/                 # Project planning & session notes
├── Dockerfile                 # Production Docker image
└── docker-compose.yml         # Production deployment config
```

## Supported Methods & Algorithms

### Beginner's Method (9 algorithms)
Complete beginner-friendly method with step-by-step instructions:
- White Cross (intuitive)
- White Corners (R U R' U')
- Middle Layer (2 algorithms)
- Yellow Cross (F R U R' U' F')
- Yellow Edges (1 algorithm)
- Yellow Corners Position (1 algorithm)
- Yellow Corners Orient (1 algorithm)

### CFOP Method (78 algorithms)
Advanced speedsolving method:
- **Cross**: Intuitive (tips and guidance)
- **F2L**: Deferred to V1 (41 cases)
- **OLL**: All 57 cases ✅
  - Organized by shape categories
  - Multiple algorithms per case
  - Recognition hints and tips
- **PLL**: All 21 cases ✅
  - Adjacent swaps (12 cases)
  - Opposite swaps (5 cases)
  - Edge-only swaps (4 cases)

### Coming in V1
- F2L (First Two Layers) - 41 cases
- Roux method
- ZZ method

## Deployment

### Docker (Recommended)

```bash
# Build Docker image
docker build -t cube-tutor:latest .

# Run locally
docker run -p 3000:3000 cube-tutor:latest

# Or use docker-compose
docker-compose up -d
```

### Manual Deployment

```bash
# Build the application
bun run build

# Start production server
bun start
```

The production build uses Next.js standalone output mode for optimal performance and minimal Docker image size.

## Performance Metrics

Lighthouse scores (verified on all pages):
- **Performance**: 97-99/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

### Key Optimizations
- Next.js 15 App Router with RSC
- Static generation for all pages
- Optimized bundle size (~150KB gzipped)
- Lazy loading for components
- Image optimization (Next.js built-in)
- Font optimization (Geist fonts)

## Data Sources

Algorithms collected from:
- [JPerm.net](https://jperm.net) - Beginner's method tutorials
- [SpeedCubeDB](https://speedcubedb.com) - OLL/PLL algorithms and community preferences
- [AlgDB](http://algdb.net) - Additional algorithm references

All algorithm data is stored as JSON files in `src/data/algorithms/` for easy maintenance and version control.

## Browser Support

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile browsers (iOS Safari, Chrome Mobile) ✅

## Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML
- Proper heading hierarchy
- Sufficient color contrast
- Touch-friendly targets (44x44px minimum)

## Contributing

This is currently a personal project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`bun test && bun run test:e2e:docker`)
- Code follows the existing style (`bun run lint`)
- New features include tests
- README is updated if needed

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Algorithm data sourced from [JPerm.net](https://jperm.net) and [SpeedCubeDB](https://speedcubedb.com)
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com)
- Cube notation follows [WCA standards](https://www.worldcubeassociation.org/regulations/#article-12-notation)

## Roadmap

See [`.opencode/plan/implementation-plan.md`](.opencode/plan/implementation-plan.md) for detailed development roadmap and task breakdown.

### Current Status: 85% MVP Complete, Ready for Deployment

**Completed:**
- ✅ All core features implemented
- ✅ All algorithm data collected (87 total)
- ✅ 128 tests passing (98 unit + 30 E2E)
- ✅ Production build verified
- ✅ Performance optimized (Lighthouse 97-100)
- ✅ Accessibility complete (100/100)

**Next Steps:**
1. Deployment to production server
2. SSL/DNS configuration
3. V1 development (3D visualization)
