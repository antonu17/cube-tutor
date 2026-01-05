# Cube Tutor - Brainstorming & Technical Design

**Last Updated:** 2026-01-05

## Project Overview

A web application for learning Rubik's cube solving methods and speedsolving algorithms with visual, interactive learning experience. Built with portability in mind for future mobile deployment.

---

## Tech Stack (CONFIRMED)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **3D Graphics:** Three.js + React Three Fiber (for V1+)
- **State Management:** Zustand or React Context (TBD based on complexity)

### Backend & Data
- **MVP:** Static JSON files (no database)
- **V2+:** Database TBD (Supabase or Firebase candidates)
- **Algorithm Data:** JSON files with WCA notation
- **Package Manager:** Bun

### Mobile (V3)
- **Strategy:** Capacitor/Ionic to wrap web app
- **Benefit:** Single codebase for web, iOS, Android

### Deployment
- **Hosting:** Self-hosted on custom server
- **Containerization:** Docker
- **CI/CD:** Manual deployment for MVP

### Development
- **Package Manager:** Bun
- **Linting:** ESLint + Prettier
- **Version Control:** Git (already initialized)

---

## Confirmed Decisions

✅ **Algorithm Data:** Will help source and compile from existing databases (SpeedCubeDB, JPerm.net)  
✅ **Color Scheme:** Standard cube colors (White, Yellow, Green, Blue, Red, Orange)  
✅ **Package Manager:** Bun  
✅ **Case Grouping:** Start with visual patterns (shapes), support user grouping in future  
✅ **Performance:** Prioritize faster loading times  
✅ **Analytics:** Wait for V2  
✅ **PWA:** Add later  
✅ **Focus:** Beginner + CFOP methods first  

---

## Core Architecture

### Project Structure

```
cube-tutor/
├── src/
│   ├── app/                    # Next.js 14 app router pages
│   │   ├── page.tsx           # Home/puzzle selection
│   │   ├── [puzzle]/          # Dynamic puzzle routes
│   │   │   ├── [method]/      # Method selection
│   │   │   │   ├── [phase]/   # Phase selection
│   │   │   │   │   └── [case]/# Case detail view
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── cube/              # Cube-specific components
│   │   │   ├── CaseDisplay.tsx
│   │   │   ├── AlgorithmList.tsx
│   │   │   ├── CubeViewer3D.tsx      # V1+
│   │   │   └── AnimationPlayer.tsx    # V1+
│   │   ├── navigation/
│   │   │   ├── PuzzleSelector.tsx
│   │   │   ├── MethodSelector.tsx
│   │   │   ├── PhaseSelector.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── cube-engine/       # Core puzzle logic
│   │   │   ├── types.ts       # Core type definitions
│   │   │   ├── parser.ts      # Parse WCA notation -> move sequences
│   │   │   ├── state.ts       # Cubie-based puzzle state
│   │   │   ├── executor.ts    # Apply moves to state
│   │   │   ├── detector.ts    # Detect cases from state (V2+)
│   │   │   ├── renderer.ts    # Generate face-based view from cubie state
│   │   │   └── validator.ts   # Validate move notation
│   │   │
│   │   ├── data-loader/       # Load and validate JSON data
│   │   │   ├── puzzles.ts
│   │   │   ├── methods.ts
│   │   │   └── algorithms.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts          # Class name utility
│   │       └── helpers.ts
│   │
│   ├── data/                  # Static algorithm data (JSON)
│   │   ├── puzzles/
│   │   │   └── 3x3x3.json
│   │   │
│   │   ├── methods/
│   │   │   ├── beginner.json  # Layer-by-layer method
│   │   │   └── cfop.json      # Cross, F2L, OLL, PLL
│   │   │
│   │   └── algorithms/
│   │       ├── beginner/
│   │       │   ├── white-cross.json
│   │       │   ├── white-corners.json
│   │       │   ├── middle-layer.json
│   │       │   ├── yellow-cross.json
│   │       │   ├── yellow-edges.json
│   │       │   ├── yellow-corners-position.json
│   │       │   └── yellow-corners-orient.json
│   │       │
│   │       └── cfop/
│   │           ├── cross.json
│   │           ├── f2l.json
│   │           ├── oll/
│   │           │   ├── dot-shapes.json
│   │           │   ├── l-shapes.json
│   │           │   ├── line-shapes.json
│   │           │   ├── t-shapes.json
│   │           │   ├── square-shapes.json
│   │           │   ├── p-shapes.json
│   │           │   ├── w-shapes.json
│   │           │   ├── c-shapes.json
│   │           │   ├── fish-shapes.json
│   │           │   ├── knight-move-shapes.json
│   │           │   ├── lightning-shapes.json
│   │           │   ├── awkward-shapes.json
│   │           │   └── all-corners-oriented.json
│   │           │
│   │           └── pll/
│   │               ├── adjacent-swap.json    # Aa, Ab, Ja, Jb, Ra, Rb, T, F, Ga, Gb, Gc, Gd
│   │               ├── opposite-swap.json    # E, Na, Nb, V, Y
│   │               └── edges-only.json       # Ua, Ub, H, Z
│   │
│   └── types/                 # TypeScript type definitions
│       ├── puzzle.ts
│       ├── algorithm.ts
│       └── method.ts
│
├── public/                    # Static assets
│   ├── images/
│   └── icons/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.js
    └── .eslintrc.json
```

---

## Data Structure Design

### 1. Cubie-Based Puzzle State (Internal Representation)

**Core Concept:** Track individual pieces (cubies) and their positions/orientations rather than individual stickers.

#### 3x3x3 Cube Representation

```typescript
// Color enum
type Color = 'W' | 'Y' | 'G' | 'B' | 'R' | 'O';

// Corner piece: 3 colored stickers
type CornerCubie = {
  position: number;      // 0-7 (8 corner positions)
  orientation: 0 | 1 | 2; // 0=solved, 1=clockwise twist, 2=counter-clockwise
  colors: [Color, Color, Color]; // Original colors
};

// Edge piece: 2 colored stickers  
type EdgeCubie = {
  position: number;      // 0-11 (12 edge positions)
  orientation: 0 | 1;    // 0=solved, 1=flipped
  colors: [Color, Color]; // Original colors
};

// Full cube state
type CubeState = {
  corners: [CornerCubie, CornerCubie, ...]; // 8 corners
  edges: [EdgeCubie, EdgeCubie, ...];       // 12 edges
  centers: [Color, Color, Color, Color, Color, Color]; // Fixed in 3x3x3 (U,D,F,B,L,R)
};
```

**Benefits:**
- Compact representation (20 pieces vs 54 stickers)
- Easier to detect patterns and cases
- Natural for implementing move algorithms
- Closer to how cubers think about puzzles

### 2. Face-Based View (For Visualization)

```typescript
// Generated from cubie state for display
type FaceView = {
  U: Color[]; // 9 stickers (0-8)
  D: Color[]; // 9 stickers
  F: Color[]; // 9 stickers
  B: Color[]; // 9 stickers
  L: Color[]; // 9 stickers
  R: Color[]; // 9 stickers
};

// Sticker positions in each face (standard orientation)
// 0 1 2
// 3 4 5
// 6 7 8
```

### 3. Move Notation (WCA Standard)

```typescript
type BasicMove = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';
type Modifier = '' | '\'' | '2';  // none, counter-clockwise, 180°
type Move = `${BasicMove}${Modifier}`;

// Examples: 'R', 'U\'', 'F2'

// Future support (not MVP):
// - Wide moves: 'Rw', 'r', 'Uw', etc.
// - Rotations: 'x', 'y', 'z' and modifiers
// - Slice moves: 'M', 'E', 'S'
```

### 4. Algorithm Data Schema

#### Puzzle Definition
```json
{
  "id": "3x3x3",
  "name": "3×3×3 Cube",
  "description": "The standard Rubik's Cube",
  "notation": "WCA",
  "methods": ["beginner", "cfop"]
}
```

#### Method Definition - CFOP
```json
{
  "id": "cfop",
  "name": "CFOP",
  "fullName": "Cross, F2L, OLL, PLL",
  "description": "Popular speedsolving method used by most world-class solvers",
  "puzzle": "3x3x3",
  "difficulty": "advanced",
  "phases": [
    {
      "id": "cross",
      "name": "Cross",
      "description": "Solve the bottom cross (4 edges)",
      "order": 1,
      "intuitive": true
    },
    {
      "id": "f2l",
      "name": "F2L",
      "fullName": "First Two Layers",
      "description": "Insert corner-edge pairs",
      "order": 2,
      "caseCount": 41
    },
    {
      "id": "oll",
      "name": "OLL",
      "fullName": "Orientation of Last Layer",
      "description": "Orient all last layer pieces (yellow facing up)",
      "order": 3,
      "caseCount": 57
    },
    {
      "id": "pll",
      "name": "PLL",
      "fullName": "Permutation of Last Layer",
      "description": "Permute all last layer pieces to solve cube",
      "order": 4,
      "caseCount": 21
    }
  ]
}
```

#### Method Definition - Beginner
```json
{
  "id": "beginner",
  "name": "Beginner Method",
  "fullName": "Layer by Layer (LBL)",
  "description": "Intuitive method for solving the cube layer by layer",
  "puzzle": "3x3x3",
  "difficulty": "beginner",
  "phases": [
    {
      "id": "white-cross",
      "name": "White Cross",
      "description": "Solve the white cross on bottom (white edges + matching centers)",
      "order": 1,
      "intuitive": true,
      "tips": [
        "Hold white center on top",
        "Find white edges in bottom",
        "Match edge color to center color"
      ]
    },
    {
      "id": "white-corners",
      "name": "White Corners",
      "description": "Complete the white face (first layer)",
      "order": 2,
      "caseCount": 1,
      "algorithmName": "Right/Left 4-moves"
    },
    {
      "id": "middle-layer",
      "name": "Middle Layer",
      "description": "Insert middle layer edges",
      "order": 3,
      "caseCount": 2,
      "cases": ["Left edge", "Right edge"]
    },
    {
      "id": "yellow-cross",
      "name": "Yellow Cross",
      "description": "Create yellow cross on top (orient yellow edges)",
      "order": 4,
      "caseCount": 3,
      "cases": ["Dot", "L shape", "Line"]
    },
    {
      "id": "yellow-edges",
      "name": "Yellow Edges",
      "description": "Position yellow edges correctly",
      "order": 5,
      "caseCount": 2,
      "cases": ["Adjacent swap", "Opposite swap"]
    },
    {
      "id": "yellow-corners-position",
      "name": "Position Yellow Corners",
      "description": "Move yellow corners to correct positions",
      "order": 6,
      "caseCount": 1
    },
    {
      "id": "yellow-corners-orient",
      "name": "Orient Yellow Corners",
      "description": "Twist yellow corners to solve cube",
      "order": 7,
      "caseCount": 1,
      "algorithmName": "Repeat 4-moves"
    }
  ]
}
```

#### Algorithm Case Schema - CFOP OLL Example
```json
{
  "category": "Dot Shapes",
  "description": "OLL cases where no edges are oriented (dot pattern on top)",
  "cases": [
    {
      "id": "oll_1",
      "number": 1,
      "name": "Dot 1",
      "standardName": "OLL 1",
      "description": "All edges oriented incorrectly, dot pattern",
      "recognitionHints": [
        "No yellow on top edges",
        "Yellow dot in center only"
      ],
      "difficulty": "medium",
      "frequency": "rare",
      "probability": "1/216",
      "setup": "R U2 R2 F R F' U2 R' F R F'",
      "algorithms": [
        {
          "notation": "R U2 R2 F R F' U2 R' F R F'",
          "moveCount": 11,
          "name": "Standard",
          "difficulty": "medium",
          "speed": "fast",
          "fingertricks": "Right hand dominant, regripless",
          "notes": "Most popular algorithm for this case",
          "source": "speedcubedb.com"
        },
        {
          "notation": "R U2 R' U' R U R' U' R U' R'",
          "moveCount": 11,
          "name": "Alternative",
          "difficulty": "easy",
          "speed": "slow",
          "notes": "Easier to learn, no F moves"
        }
      ],
      "relatedCases": ["oll_2", "oll_3"],
      "tags": ["dot", "no-edges-oriented"]
    }
  ]
}
```

#### Algorithm Case Schema - Beginner Example
```json
{
  "phase": "middle-layer",
  "description": "Insert edges into the middle layer",
  "cases": [
    {
      "id": "beginner_middle_right",
      "name": "Right Edge",
      "description": "Edge needs to go to the right side",
      "recognitionHints": [
        "Top edge matches front center",
        "Top color of edge matches right center"
      ],
      "setup": "Hold cube so edge is on top front, matching right center color",
      "algorithms": [
        {
          "notation": "U R U' R' U' F' U F",
          "name": "Right Insert",
          "description": "Turn top, do right 4-moves, rotate cube right, do left 4-moves",
          "moveCount": 8,
          "difficulty": "beginner",
          "mnemonic": "Up with right hand, right 4-moves, face right, left 4-moves"
        }
      ]
    },
    {
      "id": "beginner_middle_left",
      "name": "Left Edge",
      "description": "Edge needs to go to the left side",
      "recognitionHints": [
        "Top edge matches front center",
        "Top color of edge matches left center"
      ],
      "setup": "Hold cube so edge is on top front, matching left center color",
      "algorithms": [
        {
          "notation": "U' L' U L U F U' F'",
          "name": "Left Insert",
          "description": "Turn top, do left 4-moves, rotate cube left, do right 4-moves",
          "moveCount": 8,
          "difficulty": "beginner",
          "mnemonic": "Up with left hand, left 4-moves, face left, right 4-moves"
        }
      ]
    }
  ]
}
```

---

## Algorithm Data Sources

### Primary Sources (Confirmed)

**1. SpeedCubeDB (www.speedcubedb.com)**
- ✅ Comprehensive OLL database (57 cases)
- ✅ Complete PLL database (21 cases)
- ✅ Multiple algorithms per case with:
  - WCA notation
  - Move counts
  - Community voting
  - Fingertrick notes
  - Video links (YouTube)
- ✅ Organized by shape categories
- ✅ Free to use for educational purposes

**2. JPerm.net**
- ✅ Excellent beginner tutorial with step-by-step guide
- ✅ Beginner method (layer-by-layer) with clear explanations
- ✅ OLL/PLL algorithm trainers
- ✅ Move notation guide
- ✅ Fingertrick tutorials

### Data Collection Strategy

**Phase 1: Beginner Method (Priority 1)**
- Extract algorithms from JPerm beginner tutorial
- ~10-15 key algorithms total
- 7 phases: White Cross (intuitive) → White Corners → Middle Layer → Yellow Cross → Yellow Edges → Position Corners → Orient Corners

**Phase 2: CFOP OLL (Priority 2)**
- Scrape/adapt data from SpeedCubeDB OLL page
- 57 cases organized by shape:
  - Dot Shapes (8 cases)
  - L Shapes (6 cases)
  - Line Shapes (4 cases)
  - T Shapes (2 cases)
  - Square Shapes (2 cases)
  - P Shapes (4 cases)
  - W Shapes (2 cases)
  - C Shapes (2 cases)
  - Fish Shapes (4 cases)
  - Knight Move Shapes (4 cases)
  - Lightning Shapes (6 cases)
  - Awkward Shapes (4 cases)
  - All Corners Oriented (2 cases)
  - OCLL (7 cases)
- Focus on top 1-2 algorithms per case

**Phase 3: CFOP PLL (Priority 3)**
- Scrape/adapt data from SpeedCubeDB PLL page
- 21 cases organized by type:
  - Adjacent Swap (12 cases): Aa, Ab, Ja, Jb, Ra, Rb, T, F, Ga, Gb, Gc, Gd
  - Opposite Swap (5 cases): E, Na, Nb, V, Y
  - Edges Only (4 cases): Ua, Ub, H, Z

**Phase 4: F2L (Future)**
- 41 cases (intuitive + algorithmic approaches)
- Lower priority for MVP

### Data Extraction Notes

- SpeedCubeDB displays data in HTML, need to parse or manually transcribe
- Focus on "Standard" algorithm (highest community votes) for MVP
- Capture: notation, move count, difficulty, notes
- Attribution: Include source URLs in JSON files
- Validation: Parse each algorithm through our WCA parser before storing

---

## MVP Feature Specification

### User Flow

```
1. Landing Page
   └─> Select Puzzle (only 3x3x3 available)
       └─> Select Method (Beginner or CFOP)
           └─> Select Phase (Cross, F2L, OLL, etc.)
               └─> Browse Cases (grouped by category/shape)
                   └─> View Case Details
                       ├─> Case description & recognition hints
                       ├─> Multiple algorithm options
                       └─> Algorithm metadata (move count, difficulty, etc.)
```

### Core Features (MVP - Text Mode)

✅ **Navigation System**
- Puzzle selection page (only 3x3x3 for MVP)
- Method selection page (Beginner vs CFOP)
- Phase selection page with descriptions & phase order
- Case browser with shape/category grouping
- Case detail page with all algorithms
- Breadcrumb navigation
- Mobile-responsive layout (320px+)

✅ **Case Display**
- Case number and standard name (e.g., "OLL 21", "T-Perm")
- Description and recognition hints
- Multiple algorithm options per case
- Algorithm metadata display:
  - Move notation (WCA format, monospace font)
  - Move count (ETM/STM)
  - Difficulty rating
  - Speed rating
  - Fingertrick notes
  - Mnemonic/learning tips
  - Source attribution

✅ **Algorithm Presentation**
- Display in monospace font for readability
- Parse and validate notation
- Color-code different move types (optional enhancement)
- Show setup algorithms for cases
- Copy-to-clipboard button for algorithms

✅ **Data Organization**
- **CFOP:**
  - Cross: Intuitive (tips/description only)
  - F2L: Postpone to post-MVP (41 cases)
  - OLL: 57 cases grouped by 13 shape categories
  - PLL: 21 cases grouped by 3 swap types
- **Beginner:** 
  - 7 phases with key algorithms (~10-15 total)
  - Clear step-by-step progression
  - Mnemonic aids for memorization

❌ **Excluded from MVP (V1+)**
- 2D/3D visualization
- Animation player
- Interactive cube
- Graphics/images
- F2L (postpone to post-MVP)

### Design Principles

- **Clean & Simple:** Minimal, distraction-free interface
- **Mobile-First:** Responsive design from day one
- **Fast:** Static site generation where possible, optimized bundle
- **Accessible:** Semantic HTML, keyboard navigation, ARIA labels
- **Progressive Enhancement:** Core functionality without JS
- **Readable:** Clear typography, good contrast, monospace for algorithms

---

## V1 Features (Graphics & Visualization)

### 2D SVG Rendering
- Generate flat cube diagrams (2D sticker representation)
- Show "unfolded" cube view (net layout)
- Display only visible faces (e.g., front + top for OLL)
- Color-coded stickers matching standard cube colors
- SVG icons for case thumbnails

### 3D Visualization
- Three.js + React Three Fiber integration
- Interactive 3D cube viewer (orbit controls)
- Rotate/zoom controls
- Before/after state comparison
- Smooth cube colors and lighting

### Animation Player
- Step-through algorithm execution
- Play/pause/reset controls
- Speed control slider (0.5x - 2x)
- Forward/backward step navigation
- Visual highlighting of moving pieces
- Auto-loop option

---

## V2 Features (User Accounts & Progress)

### User Authentication
- Sign up / Sign in (email/password or OAuth)
- Session management
- Profile page
- Password reset

### Learning Path Tracking
- Mark algorithms as "learning", "learned", "mastered"
- Track practice sessions with timestamps
- Progress statistics (% learned per method/phase)
- Time spent practicing
- Personalized algorithm recommendations based on gaps

### Scramble Generation
- Generate scrambles for specific cases
- WCA-compliant random scrambles (17-19 moves for 3x3x3)
- Practice mode with timer
- Verify solutions
- Practice history log

### Database Migration
- Move from JSON to database (Supabase recommended)
- User data persistence
- Algorithm favorites/bookmarks
- Personal notes on algorithms
- Custom algorithm variants

### Additional Features
- Dark mode toggle
- Algorithm comparison tool (side-by-side)
- Print-friendly algorithm sheets (CSS print styles)
- Export progress data

---

## V3 Features (Mobile Apps)

### iOS & Android Apps
- Wrap web app with Capacitor
- Native navigation feel (hardware back button)
- App store deployment
- Offline mode (cache algorithms locally with Service Worker)
- Push notifications for practice reminders
- Share algorithms to social media
- Native performance optimizations

---

## Technical Considerations

### Cube Engine Implementation

#### Move Parser
```typescript
// Parse WCA notation string to move array
function parseAlgorithm(notation: string): Move[] {
  // "R U R' U'" => ['R', 'U', 'R\'', 'U\'']
  // Handle: spaces, basic moves, modifiers (', 2)
  // Validate: proper notation, no invalid moves
  // Throw error on invalid notation
}
```

#### State Executor
```typescript
// Apply a single move to cube state
function applyMove(state: CubeState, move: Move): CubeState {
  // Clone state (immutable approach)
  // Execute move logic (rotate affected pieces)
  // Update piece orientations
  // Return new state
}

// Execute full algorithm step-by-step
function executeAlgorithm(
  initialState: CubeState,
  algorithm: Move[]
): CubeState[] {
  // Return array of states (one per move)
  // Useful for animation/step-through in V1
}
```

#### Face Renderer
```typescript
// Convert cubie-based state to face-based view
function renderFaces(state: CubeState): FaceView {
  // Map each cubie to its stickers on faces
  // Handle orientations correctly (clockwise/counter-clockwise)
  // Return 6 faces with 9 stickers each
}
```

### Performance Considerations

- **Memoize** cube state transformations (React useMemo)
- **Pre-compute** solved state for comparisons
- **Lazy load** algorithm data (route-based code splitting with Next.js)
- **Bundle optimization:** Tree-shaking, minimize dependencies
- **Image optimization:** Use Next.js Image component for future graphics
- **Code splitting:** Dynamic imports for large components
- **Web Workers** for heavy computation (V2+ for scramble generation)

### i18n Planning (Future)

```typescript
// Structure for i18n support (not MVP, but plan ahead)
type LocalizedContent = {
  en: string;
  es?: string;
  fr?: string;
  zh?: string;
  // etc.
};

// Algorithm metadata with i18n:
{
  "name": {
    "en": "Standard",
    "es": "Estándar",
    "fr": "Standard"
  },
  "description": {
    "en": "Most popular algorithm",
    "es": "Algoritmo más popular",
    "fr": "Algorithme le plus populaire"
  }
}
```

**i18n Strategy:**
- Use next-intl or react-i18next
- Store translations in separate JSON files
- Default to English
- Algorithm notations stay universal (WCA is international)
- Translate UI strings, descriptions, hints, notes

---

## Open Questions & Resolved Decisions

### ✅ Resolved

1. **Algorithm Data:** Source from SpeedCubeDB & JPerm.net, manually curate
2. **Color Scheme:** Standard cube colors (W/Y/G/B/R/O)
3. **Package Manager:** Bun
4. **Case Grouping:** Visual patterns (shapes) with filtering
5. **Performance Target:** Fast page loads (<2s on 4G)
6. **Analytics:** Wait for V2
7. **PWA:** Add in post-MVP phase
8. **Methods:** Focus on Beginner + CFOP first

### ❓ Still Open

1. **Notation Parser Strictness:** How forgiving should we be?
   - **Recommendation:** Strict validation for data files, lenient display (ignore extra spaces)

2. **State Management:** Do we need global state?
   - **Recommendation:** Start with React Server Components + URL params for MVP
   - Add Zustand only if needed in V1 for 3D viewer state

3. **Testing Strategy:**
   - Unit tests for cube engine (critical logic)
   - Integration tests for data loading
   - E2E tests for core user flows (Playwright)
   - Manual testing acceptable for MVP

4. **Server Specs:** What are the hosting requirements?
   - **Need to clarify:** RAM, CPU, storage, SSL setup, domain

5. **F2L Priority:** Include in MVP or postpone?
   - **Recommendation:** Postpone to post-MVP due to 41 cases (focus on quality over quantity)

---

## Implementation Plan

### Phase 0: Project Setup (2-3 days)
1. Initialize Next.js 14 project with TypeScript & Bun
2. Configure Tailwind CSS
3. Install and setup shadcn/ui base components
4. Setup ESLint + Prettier configuration
5. Create project directory structure
6. Initialize Docker configuration (Dockerfile, .dockerignore)
7. Setup git hooks (Husky) for pre-commit linting
8. Create README with setup instructions

### Phase 1: Cube Engine (Core Logic) (4-5 days)
1. Define TypeScript types (CubeState, Move, Algorithm, etc.) in `lib/cube-engine/types.ts`
2. Implement WCA notation parser in `lib/cube-engine/parser.ts`
3. Implement cubie-based state representation in `lib/cube-engine/state.ts`
4. Implement move executor (apply moves to state) in `lib/cube-engine/executor.ts`
5. Implement face renderer (cubie → face view) in `lib/cube-engine/renderer.ts`
6. Implement notation validator in `lib/cube-engine/validator.ts`
7. Write unit tests for all engine functions (Vitest or Jest)
8. Create solved state utility function
9. Document cube engine API

### Phase 2: Data Collection & Schema (6-8 days)
1. Finalize JSON schemas for all data types
2. **Beginner Method Data:**
   - Extract algorithms from JPerm tutorial
   - Create beginner.json method definition
   - Create 7 phase JSON files with algorithms
   - Add tips, mnemonics, recognition hints
3. **CFOP OLL Data:**
   - Scrape/transcribe data from SpeedCubeDB
   - Create cfop.json method definition
   - Create 13 OLL category JSON files (57 cases total)
   - Include top 1-2 algorithms per case
4. **CFOP PLL Data:**
   - Scrape/transcribe data from SpeedCubeDB
   - Create 3 PLL category JSON files (21 cases total)
   - Include top 1-2 algorithms per case
5. Create 3x3x3.json puzzle definition
6. Implement data loader/validator in `lib/data-loader/`
7. Write validation tests to ensure data integrity
8. Document data structure and schema

### Phase 3: UI Components (4-5 days)
1. Setup shadcn/ui components (Button, Card, Badge, Breadcrumb, etc.)
2. Create layout components:
   - Header with navigation
   - Footer with credits/links
   - Container/wrapper components
3. Create navigation components:
   - PuzzleSelector card grid
   - MethodSelector card grid
   - PhaseSelector with order indicators
   - CaseBrowser with category filters
   - Breadcrumbs for navigation
4. Create algorithm display components:
   - AlgorithmList with tabs/accordion
   - AlgorithmCard with notation, metadata, copy button
   - CaseDisplay with description, hints, tags
5. Implement responsive design (test at 320px, 768px, 1024px, 1920px)
6. Add loading states (Skeleton components)
7. Add error boundaries for graceful error handling
8. Create 404 page

### Phase 4: Pages & Routing (3-4 days)
1. Home page (/) - Puzzle selection with intro text
2. Method selection page (/[puzzle]) - Beginner vs CFOP cards
3. Phase selection page (/[puzzle]/[method]) - List of phases with progress indicators
4. Case browser page (/[puzzle]/[method]/[phase]) - Grid/list of cases by category
5. Case detail page (/[puzzle]/[method]/[phase]/[case]) - Full algorithm display
6. Setup dynamic routing with Next.js App Router
7. Implement SEO metadata (title, description, Open Graph tags)
8. Add JSON-LD structured data for SEO
9. Test all routes and navigation flows

### Phase 5: Polish & Testing (3-4 days)
1. **End-to-end testing:**
   - User can navigate from home → puzzle → method → phase → case
   - All algorithms display correctly
   - Breadcrumbs work correctly
   - Copy-to-clipboard works
2. **Responsive testing:**
   - Test on mobile (320px, 375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px, 1920px)
3. **Performance optimization:**
   - Analyze bundle size (aim for <200KB initial)
   - Implement code splitting for routes
   - Optimize font loading (subset fonts)
   - Add cache headers
4. **Accessibility audit:**
   - Keyboard navigation works
   - Screen reader testing (NVDA/VoiceOver)
   - Color contrast meets WCAG AA
   - Semantic HTML structure
5. **Browser testing:**
   - Chrome, Firefox, Safari, Edge
   - iOS Safari, Android Chrome
6. **Documentation:**
   - Update README with features, setup, deployment
   - Document API/data structure
   - Add contributing guidelines

### Phase 6: Deployment (1-2 days)
1. **Docker setup:**
   - Create optimized production Dockerfile
   - Multi-stage build for smaller image
   - Configure nginx for static file serving
   - Test locally with Docker Compose
2. **Server deployment:**
   - Build Docker image
   - Push to server
   - Setup environment variables
   - Configure reverse proxy (nginx/Caddy)
3. **Domain & SSL:**
   - Point domain to server
   - Setup SSL certificate (Let's Encrypt)
   - Configure HTTPS redirect
4. **Monitoring:**
   - Setup basic uptime monitoring
   - Configure error logging
5. **Launch:**
   - Test production deployment
   - Monitor for issues
   - Gather initial user feedback

**Total MVP Estimate: 3-4 weeks** (assuming part-time work, ~20-30 hours/week)

---

## Success Metrics (MVP)

### Functionality
- ✅ User can navigate from puzzle → method → phase → case → algorithms
- ✅ All Beginner method phases have necessary algorithms (~10-15 total)
- ✅ All CFOP OLL cases (57) have at least one algorithm
- ✅ All CFOP PLL cases (21) have at least one algorithm
- ✅ Algorithm notation is parseable and validates correctly
- ✅ Breadcrumb navigation works correctly
- ✅ Copy-to-clipboard works on all devices

### Performance
- ✅ Mobile-responsive on screens 320px+
- ✅ Fast page loads (<2s on 4G connection)
- ✅ Initial bundle size <200KB (gzipped)
- ✅ Lighthouse score: 90+ on Performance, Accessibility, Best Practices, SEO

### Quality
- ✅ No JavaScript errors in browser console
- ✅ Works in Chrome, Firefox, Safari, Edge
- ✅ Keyboard navigation functional
- ✅ Screen reader compatible
- ✅ WCAG AA color contrast compliance

---

## Future Enhancements (Post-MVP)

### Features
- **Algorithm trainer:** Quiz mode for memorization
- **Random case generator:** Practice mode
- **Algorithm comparison:** Side-by-side comparison tool
- **Favorites system:** Bookmark favorite algorithms (localStorage for MVP)
- **Dark mode:** Toggle dark/light theme
- **Print mode:** CSS optimized for printing algorithm sheets
- **Search:** Global search for cases/algorithms
- **Filters:** Advanced filtering (difficulty, move count, etc.)
- **F2L section:** Add 41 F2L cases
- **2-Look OLL/PLL:** Simplified beginner CFOP
- **Advanced methods:** Roux, ZZ, Petrus, etc.

### Content
- **More puzzles:** 2x2x2, 4x4x4, Megaminx, Pyraminx, Square-1
- **Video tutorials:** Embed YouTube videos for cases
- **Interactive guides:** Step-by-step beginner walkthrough
- **Glossary:** Cubing terminology explained
- **Resources page:** External links to cubing resources

---

## Resources & References

### Algorithm Databases
- ✅ https://www.speedcubedb.com/ - Primary source for OLL/PLL
- ✅ https://jperm.net/ - Primary source for Beginner method
- https://www.speedsolving.com/wiki/ - Cubing wiki (reference)
- https://www.cubeskills.com/ - Tutorial site (reference)

### Cube Notation & Tutorials
- https://jperm.net/3x3/moves - WCA notation guide
- https://ruwix.com/the-rubiks-cube/notation/ - Notation reference
- https://www.worldcubeassociation.org/ - WCA official site

### Cube Libraries (for reference/inspiration)
- https://github.com/cubing/cubing.js - JavaScript cubing library
- https://github.com/ldez/cubejs - Cube state library
- https://github.com/torjusti/cube-solver - Solver implementation

### 3D Visualization Examples (for V1)
- https://cube.rider.biz/ - Roofpig (cube animator)
- https://alpha.twizzle.net/ - Modern cube explorer
- https://ruwix.com/online-puzzle-simulators/ - Various simulators

### Next.js & React Resources
- https://nextjs.org/docs - Next.js documentation
- https://ui.shadcn.com/ - shadcn/ui component library
- https://tailwindcss.com/docs - Tailwind CSS documentation
- https://bun.sh/docs - Bun documentation

---

## Timeline Estimate

**MVP (Text Mode):**
- Phase 0: Setup & Infrastructure: 2-3 days
- Phase 1: Cube Engine: 4-5 days
- Phase 2: Data Collection: 6-8 days *(most time-consuming)*
- Phase 3: UI Components: 4-5 days
- Phase 4: Pages & Routing: 3-4 days
- Phase 5: Testing & Polish: 3-4 days
- Phase 6: Deployment: 1-2 days

**Total MVP: ~3-4 weeks** (23-31 days, assuming part-time work at 4-6 hours/day)

**Post-MVP:**
- V1 (Graphics & Animation): +2-3 weeks  
- V2 (User Accounts & Progress): +2-3 weeks  
- V3 (Mobile Apps): +1-2 weeks  

---

## Notes & Ideas

### Algorithm Learning Features (Future)
- "Random case" button for practice
- Algorithm comparison tool (side-by-side)
- "Favorite" algorithms (localStorage for MVP, DB for V2)
- Algorithm ratings/reviews (V2)
- Personal notes on algorithms (V2)
- Learning streaks and gamification (V2)

### Algorithm Tools (Future)
- Inverse algorithm generator (reverse the moves)
- Mirror algorithm generator (mirror symmetry)
- Algorithm simplifier (detect redundant moves)
- Notation converter (different notation systems)

### Content Features (Future)
- Video tutorials embedded (YouTube)
- Timer integration for practice (stackmat compatible)
- Solve analyzer (enter scramble + solution)
- Personal bests and statistics (V2)
- Competition scramble archive (V2)

### Community Features (V2+)
- Community algorithm submissions
- Algorithm ratings and comments
- User-generated algorithm collections
- Share custom practice sets
- Social features (follow cubers, share progress)

---

**Last Updated:** 2026-01-05  
**Next Review:** After Phase 0 completion
