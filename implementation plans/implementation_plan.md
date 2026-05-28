# Phase 1 — Success English Frontend Home Page (Public Course Listing)

The goal is to build the public-facing home page for **Success English** that displays all available courses. No authentication is required. Course cards are **non-functional** (no click/navigation) — interactivity will be added in a later phase.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Build tool | Vite |
| Framework | React 18+ with TypeScript |
| Styling | Tailwind CSS |
| HTTP client | `fetch` API (no external library) |
| Font | Inter (via Google Fonts or Tailwind standard sans) |

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Project Init

```bash
npx -y create-vite@latest ./ --template react-ts
npm install
```

#### [NEW] Tailwind CSS Setup

Install Tailwind CSS, PostCSS, and Autoprefixer:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### [MODIFY] `tailwind.config.js`
Configure template paths to scan all React/TS files:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          accent: '#6366F1', // Indigo accent
        }
      }
    },
  },
  plugins: [],
}
```

Clean up boilerplate: remove `src/App.css`, `src/assets/react.svg`, and default counter code.

---

### 2. Design System & Global Styles

#### [MODIFY] `src/index.css`
Inject Tailwind directives and set base document background/colors:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-[#080B11] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white;
    font-family: 'Inter', sans-serif;
  }
}
```

---

### 3. Layout Components

#### [NEW] `src/components/Navbar.tsx`
- Sticky top navigation bar with glassmorphism styling (`backdrop-blur-md bg-slate-950/70 border-b border-slate-800/60`).
- **"Success English"** logo/brand name on the left (gradient text effect).
- Placeholder navigation links (Home, Courses, About — styled but non-functional).
- A premium "Sign In" CTA button (non-functional).

#### [NEW] `src/components/Footer.tsx`
- Minimalist dark footer styled with Tailwind.
- Features **Success English** copyright, description, and social media icons placeholders.

#### [NEW] `src/components/Layout.tsx`
- Wraps the `Navbar`, main content container, and `Footer`.
- Provides consistent page layout constraints.

---

### 4. Home Page Sections

#### [NEW] `src/components/Hero.tsx`
- Full-width attention-grabbing banner section.
- Modern radial/linear background gradients with deep glow highlights.
- Main headline ("Master English with Confidence"), engaging subtext about Success English, and a decorative primary CTA button.
- Subtle floating animations or gradient pulses using Tailwind transitions.

#### [NEW] `src/components/CourseCard.tsx`
- Displays: course name, description (truncated using Tailwind's `line-clamp-2`), and creation date.
- Card design: dark-card layout (`bg-slate-900/50 border border-slate-800/80 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300`).
- **Non-functional** (no link/navigation tags or event handlers).

#### [NEW] `src/components/CourseGrid.tsx`
- Section heading ("Explore Our Courses").
- Responsive flex/grid system: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.
- Features loading skeletons using Tailwind's `animate-pulse` class.
- Handles empty/error UI states elegantly.
- Iterates over fetched courses to render `<CourseCard />`.

---

### 5. API Integration

#### [NEW] `src/api/courses.ts`
TypeScript-safe course data fetching interface.

```ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Course {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}
```

#### [NEW] `.env`
```env
VITE_API_URL=http://localhost:3000/api
```

---

### 6. App Entry Point

#### [MODIFY] `src/App.tsx`
- Imports `Layout`, `Hero`, and `CourseGrid`.
- Triggers `fetchCourses()` inside a standard `useEffect` hook, capturing state for data, loading, and error.
- Feeds state properties into the `<CourseGrid />` component.

---

## File Tree Summary

```
src/
├── api/
│   └── courses.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Hero.tsx
│   ├── CourseCard.tsx
│   └── CourseGrid.tsx
├── App.tsx
├── index.css
└── main.tsx
.env
tailwind.config.js
postcss.config.js
```

---

## Verification Plan

### Automated
- `npm run dev` — confirm Vite dev server launches without errors.
- Web browser console check — verify `GET /api/courses` fetches 200 OK.

### Manual
- **Visual Design**: Confirm dark mode theme, typography, premium card glow, and layout responsiveness conform to desktop and mobile layouts.
- **Interactivity**: Verify course cards behave cleanly, look highly professional on hover, and do not route or trigger broken actions.
