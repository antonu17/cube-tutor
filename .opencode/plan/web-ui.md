# Cube Tutor - Web UI Rewrite Specification

## 🎯 Overview

**Goal:** Restructure the web UI to simplify information architecture and improve navigation by removing the "methods" layer and flattening the hierarchy.

**Key Changes:**
- Remove "method" from URL structure and data model
- Flatten: Puzzle → Method → Stage → Case to Puzzle → Algorithm Set → Case
- Add hamburger menu navigation
- Add algorithm overview page
- Update header with CubeView3D logo

---

## 📐 Information Architecture

### Current Structure
```
Puzzle (3x3x3)
└── Method (CFOP, Beginner)
    └── Stage (OLL, PLL, F2L)
        └── Category (Dot, L-Shape)
            └── Case
```

**URLs:**
- `/puzzles/3x3x3/cfop/oll` → Stage page
- `/puzzles/3x3x3/cfop/oll/oll-21` → Case page

### New Structure
```
Puzzle (3x3x3)
└── Algorithm Set (OLL, PLL, F2L, Beginner)
    └── Category (Dot, L-Shape)
        └── Case
```

**URLs:**
- `/puzzles/3x3x3/oll` → Algorithm set page
- `/puzzles/3x3x3/oll/oll-21` → Case page

**New Pages:**
- `/learn/algorithms` → All algorithm sets grouped by puzzle
- `/practice/trainer` → Placeholder
- `/practice/timer` → Placeholder

---

## 🗂️ Site Structure

### Navigation Menu (Hamburger)
```
Learn
  └── Algorithms
Practice
  └── Trainer
  └── Timer
About
```

### Page Hierarchy
```
Home (/)
├── Learn
│   └── Algorithms (/learn/algorithms)
│       └── Shows all algorithm sets grouped by puzzle
├── Puzzles (/puzzles)
│   └── Puzzle Page (/puzzles/3x3x3)
│       └── Algorithm Set Page (/puzzles/3x3x3/oll)
│           └── Case Page (/puzzles/3x3x3/oll/oll-21)
├── Practice
│   ├── Trainer (/practice/trainer) - Placeholder
│   └── Timer (/practice/timer) - Placeholder
└── About (/about)
```

---

## 🎨 Layout Specifications

### Main Layout (Header)

**Structure (left to right):**
```
┌───────────────────────────────────────────────────┐
│ [☰] [🎲] Cube Tutor    (flex-grow spacer)  [Theme]│
└───────────────────────────────────────────────────┘
```

**Components:**
1. **Hamburger button** - Opens side navigation panel
2. **CubeView3D logo** - 24x24px static solved cube (front view, sticker size 6px)
3. **"Cube Tutor" text** - Links to home page, font-bold text-xl
4. **Spacer** - flex-grow to push theme toggle right
5. **Theme toggle** - Keep existing implementation

**Header styling:**
- Sticky top-0 z-50
- Full width (100%)
- Border bottom
- Backdrop blur

### Hamburger Menu (Side Panel)

**Behavior:**
- Slides in from left
- Width: 280px (mobile), 320px (tablet+)
- Animation: 200ms ease-out
- Backdrop: bg-black/50 overlay
- Close: Click backdrop, ESC key, or menu item click
- Z-index: 50

**Menu Content:**
```
┌─────────────────┐
│ Navigation      │
├─────────────────┤
│ Learn           │
│   - Algorithms  │
│ Practice        │
│   - Trainer     │
│   - Timer       │
├─────────────────┤
│ About           │
└─────────────────┘
```

**Only 2 levels deep** - Top-level sections + immediate children

### Content Area

**Responsive max-widths with 2% horizontal margin:**

| Breakpoint | Max Width | Tailwind Class |
|------------|-----------|----------------|
| XL (1400px+) | 1400px | `max-w-[1400px]` |
| LG (1200-1399px) | 1200px | `lg:max-w-[1200px]` |
| MD (992-1199px) | 992px | `md:max-w-[992px]` |
| SM (768-991px) | 768px | `sm:max-w-[768px]` |
| XS (<768px) | 100% | `w-full` |

**Container classes:**
```
className="max-w-[1400px] px-[2%] mx-auto"
```

---

## 📄 Page Specifications

### 1. Algorithms Overview Page (`/learn/algorithms`) - NEW

**Purpose:** Display all algorithm sets across all puzzles, grouped by puzzle and method origin.

**Layout:**
```
┌──────────────────────────────────────────┐
│  Algorithms                               │
│  Browse algorithm sets by puzzle          │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ 3×3×3 Rubik's Cube                 │  │ ← AlgorithmSetGroupCard
│  ├────────────────────────────────────┤  │   (full width, title row)
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │  │
│  │  │ [🎲]│ │ [🎲]│ │ [🎲]│ │ [🎲]│  │  │ ← AlgorithmSetCards
│  │  │ OLL │ │ PLL │ │ F2L │ │Begnr│  │  │   (grid, 2-4 per row)
│  │  │57alg│ │21alg│ │41alg│ │9alg │  │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ 4×4×4 Cube - Coming Soon           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Components:**
- **AlgorithmSetGroupCard** - Groups sets by puzzle
  - Full width container
  - Title row: Puzzle name
  - Content row: Grid of AlgorithmSetCards
- **AlgorithmSetCard** - Individual set card
  - CubeView3D thumbnail (80x80px desktop, 60x60px mobile)
  - Algorithm set name
  - Algorithm count
  - Links to `/puzzles/{puzzleId}/{algSetId}`

**Grouping Logic:**
```
Group by Puzzle:
  3×3×3
    ├── CFOP OLL (57 algs)
    ├── CFOP PLL (21 algs)
    ├── CFOP F2L (41 algs)
    └── Beginner (9 algs)
  4×4×4
    └── (Coming soon)
```

### 2. Puzzle Page (`/puzzles/[puzzleId]`)

**Current:** Shows methods (Beginner, CFOP) as cards

**New:** Shows algorithm sets directly, grouped visually by origin

**Layout:**
```
┌──────────────────────────────────────────┐
│  3×3×3 Rubik's Cube                       │
│  Algorithm Sets                           │
├──────────────────────────────────────────┤
│  CFOP Method                              │ ← Optional section header
│  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │  [🎲]  │ │  [🎲]  │ │  [🎲]  │     │
│  │   OLL  │ │   PLL  │ │   F2L  │     │
│  │ 57 algs│ │ 21 algs│ │ 41 algs│     │
│  └─────────┘ └─────────┘ └─────────┘     │
│                                           │
│  Beginner Method                          │
│  ┌─────────┐                              │
│  │  [🎲]  │                              │
│  │Beginner│                              │
│  │  9 algs│                              │
│  └─────────┘                              │
└──────────────────────────────────────────┘
```

**Changes:**
- Remove method selection concept
- Display algorithm sets in grid (use AlgorithmSetCard)
- Optional: Section headers for grouping (CFOP Method, Beginner Method)
- Breadcrumbs: Home > Puzzles > 3×3×3

### 3. Algorithm Set Page (`/puzzles/[puzzleId]/[algSetId]`)

**Current:** `/puzzles/[puzzleId]/[methodId]/[stageId]` with category browser

**New:** `/puzzles/[puzzleId]/[algSetId]` - same functionality, simpler URL

**Layout:** Keep existing CaseBrowser component
```
┌──────────────────────────────────────────┐
│  Home > Puzzles > 3×3×3 > OLL            │ ← Breadcrumbs (no method)
│  OLL (Orient Last Layer)                 │
│  Orient all pieces to show yellow on top │
├──────────────────────────────────────────┤
│  ▼ Dot Shapes (8 cases)                  │ ← Accordion sections
│    [Case 1]  [Case 2]  [Case 3]  ...     │
│  ▼ L Shapes (9 cases)                    │
│    [Case 4]  [Case 5]  ...               │
└──────────────────────────────────────────┘
```

**Changes:**
- Route: `[stageId]` → `[algSetId]`
- Breadcrumbs: Remove method level
- Keep all existing functionality

### 4. Case Detail Page (`/puzzles/[puzzleId]/[algSetId]/[caseId]`)

**Current:** `/puzzles/[puzzleId]/[methodId]/[stageId]/[caseId]`

**New:** Remove `[methodId]` from URL

**Changes:**
- Update route structure
- Update breadcrumbs (Home > Puzzles > 3×3×3 > OLL > OLL-21)
- Keep all existing visualization and algorithm display

### 5. Practice Pages - NEW PLACEHOLDERS

**Trainer Page** (`/practice/trainer`)
```tsx
<Container>
  <PageHeader 
    title="Algorithm Trainer"
    subtitle="Coming Soon"
  />
  <div className="rounded-lg border border-dashed p-12 text-center">
    <p className="text-muted-foreground">
      Practice algorithms with scrambles and timing
    </p>
  </div>
</Container>
```

**Timer Page** (`/practice/timer`)
```tsx
<Container>
  <PageHeader 
    title="Speedsolving Timer"
    subtitle="Coming Soon"
  />
  <div className="rounded-lg border border-dashed p-12 text-center">
    <p className="text-muted-foreground">
      Track your solve times with a professional timer
    </p>
  </div>
</Container>
```

---

## 🗃️ Data Structure Changes

### File Structure

**BEFORE:**
```
src/data/
├── puzzles/
│   └── 3x3x3.json
├── methods/
│   └── 3x3x3/
│       ├── cfop.json
│       └── beginner.json
└── algorithms/
    ├── cfop/oll/all-cases.json
    ├── cfop/pll/all-cases.json
    └── beginner/all/all-cases.json
```

**AFTER:**
```
src/data/
├── puzzles/
│   └── 3x3x3.json (updated)
├── algorithm-sets/
│   └── 3x3x3/
│       ├── oll.json (merged from cfop.json + stage)
│       ├── pll.json
│       ├── f2l.json
│       └── beginner.json
└── algorithms/
    ├── oll/all-cases.json (renamed)
    ├── pll/all-cases.json
    ├── f2l/all-cases.json
    └── beginner/all-cases.json
```

### New TypeScript Types

**Remove:**
- `MethodData` interface

**Add:**
```typescript
export interface AlgorithmSet {
  id: string;                    // "oll", "pll", "f2l", "beginner"
  puzzleId: string;              // "3x3x3"
  name: string;                  // "OLL (Orient Last Layer)"
  shortName: string;             // "OLL"
  description: string;
  origin: string;                // "cfop", "beginner", "roux"
  originName: string;            // "CFOP Method"
  order: number;                 // Display order within origin
  caseCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  categories: {
    id: string;
    name: string;
    description: string;
    caseCount: number;
  }[];
}

export interface AlgorithmSetGroup {
  id: string;                    // "cfop", "beginner"
  name: string;                  // "CFOP Method"
  description: string;
  algorithmSets: AlgorithmSet[];
}

export interface Puzzle {
  id: string;
  type: string;
  name: string;
  description: string;
  dimensions: number[];
  algorithmSetGroups: string[];  // ["cfop", "beginner"]
}
```

### Example: Algorithm Set JSON

**File:** `src/data/algorithm-sets/3x3x3/oll.json`
```json
{
  "id": "oll",
  "puzzleId": "3x3x3",
  "name": "OLL (Orient Last Layer)",
  "shortName": "OLL",
  "description": "Orient all pieces on the last layer to show yellow on top",
  "origin": "cfop",
  "originName": "CFOP Method",
  "order": 3,
  "caseCount": 57,
  "difficulty": "advanced",
  "categories": [
    {
      "id": "dot",
      "name": "Dot Shapes",
      "description": "Cases with a yellow dot on top",
      "caseCount": 8
    }
  ]
}
```

---

## 🧩 Component Changes

### Components to Create

1. **`HamburgerMenu.tsx`** - Side navigation panel
2. **`AlgorithmSetCard.tsx`** - Replaces PhaseCard (rename + update)
3. **`AlgorithmSetGroupCard.tsx`** - Groups sets by puzzle/method

### Components to Update

1. **`Header.tsx`** - Add hamburger, CubeView3D logo, remove inline nav
2. **`Breadcrumbs.tsx`** - Remove method level from path generation
3. **`Container.tsx`** - Update max-width classes if needed

### Components to Remove

1. **`MethodCard.tsx`** - No longer needed

### Components to Keep

- `PuzzleCard.tsx` - Keep for future expansion
- `CaseCard.tsx` - No changes
- `CaseBrowser.tsx` - No changes
- `CaseDetail.tsx` - Minor breadcrumb updates
- All cube visualization components - No changes

---

## 📦 Data Loader Changes

### New File: `src/lib/data-loader/algorithm-sets.ts`

```typescript
export async function loadAlgorithmSet(
  puzzleId: string, 
  algSetId: string
): Promise<AlgorithmSet>;

export async function loadAlgorithmSetsForPuzzle(
  puzzleId: string
): Promise<AlgorithmSet[]>;

export async function loadAllAlgorithmSets(): Promise<AlgorithmSet[]>;

export async function loadAlgorithmSetsByGroup(
  puzzleId: string
): Promise<AlgorithmSetGroup[]>;
```

### Remove: `src/lib/data-loader/methods.ts`

### Update: `src/lib/data-loader/index.ts`

```typescript
export { loadPuzzle, loadAllPuzzles } from "./puzzles";
export { 
  loadAlgorithmSet, 
  loadAlgorithmSetsForPuzzle,
  loadAllAlgorithmSets,
  loadAlgorithmSetsByGroup 
} from "./algorithm-sets";
export { 
  loadAlgorithms, 
  loadAlgorithmsByCategory, 
  loadCase 
} from "./algorithms";
```

---

## 🚀 Implementation Plan

### Phase 1: Data Migration
- [ ] Create `algorithm-sets/` directory structure
- [ ] Create migration script to convert method+stage → algorithm set
- [ ] Migrate CFOP stages (oll.json, pll.json, f2l.json)
- [ ] Migrate beginner method (beginner.json)
- [ ] Update puzzle JSON files
- [ ] Validate all data loads correctly

### Phase 2: Types & Loaders
- [ ] Update TypeScript types in `src/types/data.ts`
- [ ] Create `algorithm-sets.ts` data loader
- [ ] Update `algorithms.ts` loader for new paths
- [ ] Update `puzzles.ts` loader for new structure
- [ ] Remove `methods.ts` loader
- [ ] Update exports in `index.ts`

### Phase 3: Layout Updates
- [ ] Create `HamburgerMenu.tsx` component
- [ ] Update `Header.tsx` with hamburger + logo
- [ ] Add CubeView3D logo (24px, solved state, front view)
- [ ] Test responsive behavior
- [ ] Update `Container.tsx` max-widths if needed

### Phase 4: Page Migration
- [ ] Create `/learn/algorithms` page
- [ ] Create `AlgorithmSetGroupCard.tsx` component
- [ ] Update `/puzzles/[puzzleId]` page (show alg sets)
- [ ] Rename `[methodId]/[stageId]` → `[algSetId]`
- [ ] Rename `[methodId]/[stageId]/[caseId]` → `[algSetId]/[caseId]`
- [ ] Create `/practice/trainer` placeholder
- [ ] Create `/practice/timer` placeholder
- [ ] Update all internal links

### Phase 5: Component Updates
- [ ] Rename `PhaseCard.tsx` → `AlgorithmSetCard.tsx`
- [ ] Update `AlgorithmSetCard` props and logic
- [ ] Update `Breadcrumbs.tsx` (remove method level)
- [ ] Remove `MethodCard.tsx`
- [ ] Update all component imports

### Phase 6: Testing & Cleanup
- [ ] Update E2E tests for new routes
- [ ] Test all navigation flows
- [ ] Test hamburger menu on mobile/desktop
- [ ] Test all algorithm set pages load correctly
- [ ] Remove old `methods/` data directory
- [ ] Update README documentation
- [ ] Verify build succeeds
- [ ] Run full test suite

---

## ✅ Definition of Done

- [ ] All data migrated to `algorithm-sets/` structure
- [ ] Old `methods/` directory removed
- [ ] TypeScript types updated
- [ ] Data loaders refactored and working
- [ ] Header with hamburger menu and logo implemented
- [ ] Navigation side panel functional
- [ ] `/learn/algorithms` page displaying all sets
- [ ] Practice placeholder pages created
- [ ] All routes updated (no `[methodId]` in URLs)
- [ ] Breadcrumbs display correct hierarchy
- [ ] All components renamed/refactored
- [ ] All internal links updated
- [ ] E2E tests passing (30+ tests)
- [ ] Build succeeds with no errors
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Documentation updated

---

## 📋 URL Migration Map

| Old URL | New URL | Status |
|---------|---------|--------|
| `/` | `/` | No change |
| `/puzzles` | `/puzzles` | No change |
| `/about` | `/about` | No change |
| `/puzzles/3x3x3` | `/puzzles/3x3x3` | Content changes |
| `/puzzles/3x3x3/cfop` | **REMOVED** | - |
| `/puzzles/3x3x3/cfop/oll` | `/puzzles/3x3x3/oll` | Simplified |
| `/puzzles/3x3x3/cfop/oll/oll-21` | `/puzzles/3x3x3/oll/oll-21` | Simplified |
| `/puzzles/3x3x3/beginner` | **REMOVED** | - |
| `/puzzles/3x3x3/beginner/all` | `/puzzles/3x3x3/beginner` | Simplified |
| - | `/learn/algorithms` | NEW |
| - | `/practice/trainer` | NEW |
| - | `/practice/timer` | NEW |

---

## 🎨 Design Tokens

### Header
- **Height:** 56px (h-14)
- **Logo Size:** 24x24px
- **Logo Type:** CubeView3D (solved, front view, stickerSize=6)
- **Hamburger Icon:** Lucide `Menu` icon (24x24px)

### Hamburger Menu
- **Width:** 280px (mobile), 320px (tablet+)
- **Animation:** 200ms ease-out slide
- **Backdrop:** `bg-black/50`
- **Z-index:** 50

### Algorithm Set Card
- **Cube Size:** 80x80px (desktop), 60x60px (mobile)
- **Hover:** `scale-105` with shadow increase
- **Transition:** 200ms ease

### Content Container
- **Max Widths:** 1400px / 1200px / 992px / 768px
- **Horizontal Padding:** 2% of viewport
- **Vertical Padding:** py-10 (2.5rem)

---

This specification provides the complete blueprint for the web UI rewrite. All changes are designed to simplify the user experience while maintaining existing functionality.
