# Quantalink Portfolio - Pseudocode & Architecture Overview

This document outlines the high-level structure and logic of the Next.js portfolio application.

## 1. Global Structure (`src/app/layout.tsx`)

- **Purpose:** The root layout for the entire application.
- **Logic:**
  - `RootLayout(children)`:
    - Set HTML language to "en".
    - Load global CSS (`globals.css`).
    - Load "Space Grotesk" font from Google Fonts.
    - Define global metadata for SEO (title, description, keywords, Open Graph tags).
    - Inject JSON-LD structured data for personal schema.
    - Render `<AnimatedBackground />` so it appears on all pages.
    - Render the `{children}` (the current page).
    - Render the `<Toaster />` for notifications.

## 2. Main Page (`src/app/page.tsx`)

- **Purpose:** The homepage/landing page.
- **Logic:**
  - `Home()`:
    - Render a main container `div`.
    - Render components in a vertical stack:
      - `<ProfileSection />`
      - `<LinkCards />`
      - `<Separator />`
      - `<AboutMe />`
      - `<Separator />`
      - `<Projects featuredOnly={true} />`
      - `<Separator />`
      - `<Skills />`
      - `<Separator />`
      - `<EasterEgg />`
    - Render `<PageFooter />`.

## 3. Core Components

### 3.1. Animated Background (`src/components/animated-background.tsx`)

- **Purpose:** A client-side component to render a dynamic, QED-inspired canvas animation.
- **State:**
  - `canvasRef`: Reference to the canvas element.
  - `animationFrameId`: ID for the animation loop.
- **Logic:**
  - `useEffect()`: Runs once on component mount.
    - Get canvas context.
    - **Device Adaptation:**
      - Check `window.innerWidth`.
      - If mobile (`<= 768px`):
        - `maxParticles` = 20
        - `virtualPairSpawnRate` = 0.15
      - Else (desktop):
        - `maxParticles` = 30
        - `virtualPairSpawnRate` = 0.25
    - **Particle Class:**
      - `constructor(isVirtual)`
      - `reset()`: Initialize position, velocity, charge, color.
      - `update()`: Update position, bounce off edges, handle decay for virtual particles.
      - `draw()`: Draw particle core and aura.
    - **Animation Loop `animate()`:**
      - Clear canvas.
      - Randomly call `spawnVirtualPair()` to create virtual particles.
      - Loop through real particles to draw "Photon Exchange" lines between them if they are close.
      - Update and draw all active particles.
      - Remove dead virtual particles.
    - **Cleanup:**
      - Add `resize` event listener to re-initialize the animation on window resize.
      - Return a cleanup function to cancel the animation frame and remove the event listener.

### 3.2. Quantum Conundrum (`src/components/easter-egg.tsx`)

- **Purpose:** A client-side, game-like interactive component based on the Schrödinger's Cat thought experiment.
- **State:**
  - `isObserved`: `boolean` - Tracks if the user has "collapsed the wave function." `false` = intro screen, `true` = result screen.
  - `catState`: `'alive' | 'ghost' | null` - Stores the outcome of the experiment. `null` = superposition (initial state).
- **Logic:**
  - `observe()`:
    - This function is called when the user clicks the "Collapse the wave function" button.
    - It simulates the quantum event by using `Math.random()` to set `catState` to either `'alive'` or `'ghost'` (a 50/50 chance).
    - It then sets `isObserved` to `true`, which switches the UI to show the result.
  - `reset()`:
    - This function is called by the "Reset" button on the results screen.
    - It sets `isObserved` back to `false` and `catState` back to `null`, returning the component to its initial superposition state.
  - **Rendering:**
    - If `!isObserved`:
      - Show the introduction text and the primary "Collapse the wave function" button.
    - If `isObserved`:
      - If `catState === 'alive'`:
        - Show the "Alive" result card, which includes a `Cat` icon and a celebratory `<FunParticles type="popper" />` effect.
      - If `catState === 'ghost'`:
        - Show the "Decohered" result card, which includes a `Ghost` icon and a spooky `<FunParticles type="ghost" />` effect.
      - In either outcome, also show the "Reset Superposition" button.

### 3.3. Profile & Links (`profile-section.tsx`, `link-cards.tsx`)

- **Purpose:** Display user identity and social links.
- **Logic:**
  - Use `useInView` hook to trigger fade-in animations.
  - `ProfileSection`:
    - Renders `<Avatar>` with a local image (`/profile.webp`).
    - Renders `<h1>` with full name for SEO.
    - Renders tagline.
  - `LinkCards`:
    - Maps over a `links` array.
    - Renders a `<LinkCard>` for each item, passing props like `href`, `title`, `Icon`, and animation `delay`.
  - `LinkCard` (Client Component):
    - Uses `onMouseMove` to create a 3D tilt and background glow effect.
    - Uses `onMouseLeave` to reset the effect.

## 4. Data-Driven Content

### 4.1. Projects (`src/lib/projects-data.ts`, `src/components/projects.tsx`)

- **Data:** `projects-data.ts` exports an array of `Project` objects. Each has a title, description, URL, license, and `isFeatured` flag.
- **Component Logic (`Projects.tsx`):**
  - Accepts `featuredOnly` prop.
  - Filters the `projects` array based on `featuredOnly`.
  - Maps over the filtered array to render a `<Card>` for each project.
  - If `featuredOnly`, renders a "See More Projects" button linking to `/projects`.

### 4.2. Skills (`src/lib/skills-data.tsx`, `src/app/skills/page.tsx`)

- **Data:** `skills-data.tsx` exports an array of `SkillCategory` objects. Each category has a title, icon, and an array of `Skill` objects. Each skill has a name, note, and a custom icon component.
- **Component Logic (`SkillsPage.tsx`):**
  - Maps over `skillsData` to render each category.
  - Inside each category, maps over `category.skills` to render a `<Button>` for each skill.
  - Each button is a `<DialogTrigger>` that opens a `<DialogContent>` showing the detailed `skill.note`.

## 5. SEO & Configuration

- **`next-sitemap.config.js`:** Configured to run `postbuild` to automatically generate `sitemap.xml` and `robots.txt`.
- **`package.json`:** `"postbuild": "next-sitemap"` script is present.
- **`layout.tsx`:** Contains all primary metadata tags (`<title>`, `<meta>`, Open Graph, JSON-LD) for optimal search engine indexing.
