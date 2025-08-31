# 📎 Appendix — Quantalink Portfolio

[⬅ Back to Main README](./README.md)

> **Version:** v3.0 | **Framework:** Next.js | **Language:** TypeScript | **Author:** Akshay K Rooben Abraham

---

## Background

> "What if a portfolio wasn't just a website… but a _thought experiment_ you could explore?"

The **Quantalink Portfolio** reimagines a resume as a **physics-inspired interface**, where aesthetics, interactivity, and science converge.

### ✨ Key Concepts

| Concept                        | Inspired By                   | Implementation Details                                                        |
| ------------------------------ | ----------------------------- | ----------------------------------------------------------------------------- |
| **Quantum Foam Background**    | Quantum Electrodynamics (QED) | Animated particles, virtual photons, and vacuum fluctuations as moving nodes. |
| **Observer Effect in UI**      | Quantum Mechanics             | 3D tilt cards & reactive elements respond to cursor position.                 |
| **Schrödinger's Cat Game**     | Quantum Superposition         | Win/Loss states collapse based on player actions.                             |
| **Acrylic & Glassmorphism UI** | Modern OS Design Systems      | `backdrop-blur`, transparency layers, and soft shadows for depth.             |
| **Gamified Outcomes**          | Physics Thought Experiments   | Alive cat or ghost companion persists across pages post-game.                 |

---

## 🎮 The _Quantum Conundrum_ Mini-Game

> A playful, skill-based **gamification of Schrödinger's Cat** built entirely with React, Framer Motion, and TypeScript.

### 🧩 Core Gameplay Loop

1. **Idle State:** User opens the game modal.
2. **Play State:** Click on `Quantum Anomalies` within the time limit.
3. **Result State:**
   - **Win →** _Alive Cat_ spawns as an interactive page pet.
   - **Lose →** _Decohered Ghost_ with spooky AI haunts the site.
4. **Persistent Outcome:** Pet remains until game replay.

---

### 🕹️ Difficulty Progression

| Level | Anomalies Required | Time Limit | Difficulty Curve         |
| ----- | ------------------ | ---------- | ------------------------ |
| 1     | 5                  | 15s        | Linear growth, tutorial  |
| 2-3   | 8–12               | 12–10s     | Moderate, skill-based    |
| 4+    | 15+                | 8s         | Exponential, expert mode |

> _Powered by a dynamic state machine & localStorage to track progression._

---

### 🐾 Page Pet Behaviors

| Pet Type      | Behavior Model                                        | Interactivity                                |
| ------------- | ----------------------------------------------------- | -------------------------------------------- |
| **Alive Cat** | Random wandering + cursor-follow physics              | "Meow!" tooltip on hover & click             |
| **Ghost**     | Stalking → Hiding → Swooshing states via AI scheduler | Random opacity, sudden dashes, spooky timing |

---

## 🛠️ Developer's Log (v3.0)

> Collapsible sections for each version with detailed commits, changes, and rationale.

<details>
<summary>📜 <b>v3.0 — Final Polish & SEO Pass</b></summary>

- Added **Twitter Card metadata** for rich social sharing.
- Implemented **canonical URLs** for all pages.
- Optimized **page titles** for Google ranking (e.g., "About Akshay K Rooben Abraham").
- Rewrote **Ghost AI** with smooth stalking + swoosh mechanics.
- Persistent **Alive Cat** — removed dismiss-on-click for long-term presence.
</details>

<details>
<summary>🎮 <b>v2.3 — Gamification Update</b></summary>

- Added **full game loop** with progress bar, timer, and levels.
- Created **Global Pet State Manager** for spawning page pets across routes.
- Engineered **Fly-Out Animation** to transition result icon → roaming pet seamlessly.
- Progressive difficulty scaling with linear → exponential growth.
</details>

<details>
<summary>🖼️ <b>v2.2 — Foundational Polish</b></summary>

- Multi-page architecture with `/about`, `/skills`, `/projects`.
- InfiniteScroller for **skill logos** using SimpleIcons.
- Particle cap to prevent animation overload.
- SEO: **sitemap.xml** + **robots.txt** auto-generation via `next-sitemap`.
</details>

---

## 📂 References & Docs

- **[Main README](./README.md)** – Project overview, features, and tech stack.
- **[Pseudocode.md](./pseudocode.md)** – Architectural sketches & code flow.

# Dev log detailed

## V3.0: Final Polish & Experience Refinement

**Philosophy:** With the core interactive mechanics in place, this version was dedicated to perfecting the user experience. The focus shifted to refining "game feel," making animations smoother and more deliberate, and performing a final, comprehensive SEO pass to maximize the portfolio's reach and professional presentation.

### 🔹 Animation & Interaction Perfection

- **Ghost AI & Physics Overhaul:** The ghost's behavior was still too frantic. The goal was to make it feel less like a chaotic entity and more like a patient, menacing one.

  - **Slower, More Deliberate "Stalking":** The time the ghost spends in its slow-drifting `stalking` state was significantly increased from a few seconds to a random duration between **8 and 15 seconds**. This change makes the ghost feel more patient and its sudden movements more jarring and effective.
  - **Smoother "Swoosh" Animation:** The physics of the high-velocity dash were refined. The friction was reduced, and the animation duration was extended to a full **3000ms**. This transforms the movement from a short, jerky dash into a long, unsettling, and graceful glide across the entire screen, greatly enhancing the "spooky" factor.

- **Finalizing the Cat's Interaction Model:** The "Alive" cat's behavior was refined to make it a more persistent and endearing companion.

  - **Removed Dismiss on Click:** The `onClick` handler that removed the cat from the page was completely removed. This was a critical change to make the game's outcome feel more permanent and rewarding. The cat is now a true "page pet" that stays with the user until the game is played again.
  - **"Meow!" on Hover & Click:** The `showMeow` state is now triggered on both `onMouseEnter` and `onClick`. This makes the cat feel more consistently interactive and responsive, rewarding user curiosity without removing the pet.

- **Improving Game Feel & Usability:**
  - **Enlarged Reset Button:** The "Reset Experiment" button in the game's failure state was enlarged by applying the `size="lg"` prop. This is a small but important change that improves usability, especially on mobile, and provides a clearer call to action for the user to try again.

---

### 🔹 SEO & Metadata Enhancements

- **Rich Social Media Snippets (Twitter Cards):** A comprehensive set of Twitter-specific meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:images`) was added to the root layout (`src/app/layout.tsx`). This ensures that when a link to the portfolio is shared on social media platforms, it generates a rich, properly formatted preview card with an image and description, which is crucial for professional presentation and click-through rates.
- **Optimized Page Titles for Search Ranking:** The `<title>` tags for the dedicated `/about`, `/projects`, and `/skills` pages were rewritten to be more descriptive and keyword-rich (e.g., "About Akshay K Rooben Abraham | Story & Journey"). This helps search engines better understand the content of each page, improving their individual ranking for relevant search queries.
- **JSON-LD Structured Data:** Implemented JSON-LD in the root layout to provide Google with structured data about the site owner (as a 'Person'). This helps create rich results in search, improving visibility.
- **Canonical URLs:** Ensured every page has a canonical URL specified to prevent duplicate content issues with search engines.

---

---

## V2.3: The Quantum Pet & Gamification Update (`b013a94`)

**Philosophy:** This version marked the most significant evolution of the portfolio's interactivity. The simple "Quantum Conundrum" easter egg was completely transformed into a skill-based mini-game. The outcome of this game was given real, persistent consequences: the spawning of an interactive "page pet" whose existence is determined by the player's performance.

---

### 🔹 Major Feature: The Quantum Conundrum Mini-Game

The original feature was a simple button press with a random 50/50 outcome. V2.3 gamified this concept from the ground up, creating a compelling reason for users to engage and re-engage with the easter egg.

- **New Gameplay Loop & State Machine:**

  - A robust game state machine (`idle`, `playing`, `revealing`, `result`, `failed`) was implemented in `easter-egg.tsx` to manage the entire flow of the experience, from the intro screen to the final result.
  - **Objective:** The user's goal is to "stabilize the quantum field" by clicking on `QuantumAnomaly` components that appear at random positions within the game area.
  - **Progression & Urgency:** A progress bar (tracking anomalies left to click) and a countdown timer were added to create a sense of urgency and clear feedback.

- **Progressive Difficulty System:** To make the game a rewarding challenge, a dynamic difficulty system was implemented.

  - **Mechanism:** The `getDifficulty` function calculates the number of anomalies to collect and the time limit based on the total number of plays stored in `localStorage`.
  - **Linear Increase (Levels 1-3):** For the first three wins, the difficulty increases linearly.
  - **Compound Increase (Level 4+):** After the third win, the difficulty increases at a compound rate, making the game significantly harder for experienced players. It's capped to ensure the game remains challenging but fair.

- **Richer UI & Animations:**

  - A dedicated game interface was built inside the modal, including the progress bar, level indicator, and timer.
  - **Particle Feedback:** A `FunParticles` component was created to generate a satisfying particle burst (`type="anomaly"`) whenever a target is successfully clicked, providing immediate positive feedback.
  - The win/loss screens were made more dramatic, setting the stage for the pet spawning sequence.

- **Critical Bug Fix - Unique React Keys:** Resolved a bug where rapidly spawning anomalies could occasionally be created with the same millisecond timestamp, leading to duplicate React keys and console errors. The key generation logic was updated to use a more robust `id: \`\${Date.now()}-\${Math.random()}\``, guaranteeing uniqueness.

---

### 🔹 Major Feature: Interactive & Persistent Page Pets

This was the centerpiece of the V2.3 update. The game's outcome now directly spawns a roaming "page pet" that persists across the entire site.

- **Seamless "Fly-Out" Transition:** An advanced animation was engineered to create the illusion that the result icon (Cat or Ghost) literally flies off the result card and becomes the interactive page pet.

  - **Global State:** A new global state manager (`src/lib/pet-state.ts`) was created using a simple pub-sub model. This store holds the pet's `type` ('alive' or 'ghost') and its initial screen coordinates.
  - **Animation Mechanism:**
    1.  When the game ends, the coordinates of the result icon (`Cat` or `Ghost`) are captured using `getBoundingClientRect()`.
    2.  These coordinates are passed to the global `setPet` function.
    3.  The `GlobalPetRenderer` component, which lives in the root layout, detects the new pet state and renders the `PagePet` component.
    4.  The `PagePet` uses a dynamic CSS `fly-in` animation powered by CSS variables (`--start-x`, `--start-y`) to animate from the captured starting position to its initial roaming position.
    5.  Simultaneously, the `isResultIconVisible` state in the `EasterEgg` component is set to `false`, hiding the original icon at the exact moment the pet spawns to create a seamless, magical transition.

- **Interactive "Alive" Cat:**

  - **Behavior:** The cat now roams the page using a simple physics model, and intelligently moves towards the user's cursor when it's far away. It remains on the page indefinitely until the game is played again.
  - **Interaction:** When the user hovers over or clicks the cat, a "Meow!" speech bubble appears, adding a layer of charming interactivity.

- **Terrifying "Decohered" Ghost:**
  - **Behavior Overhaul:** The ghost's AI was completely rewritten in `page-pet.tsx` to be genuinely spooky and unpredictable.
  - **State Machine:** The ghost now operates on its own internal state machine, randomly switching between three modes:
    1.  `stalking`: Drifts slowly and menacingly across the screen.
    2.  `hiding`: Briefly turns invisible (`opacity: 0`) for a few seconds.
    3.  `swooshing`: Executes a sudden, high-velocity dash to a random point on the screen, creating a startling effect.

---

---

## V2.2: Pre-Gamification & Foundational Polish (`ebc70a1`)

**Philosophy:** This version represents the modern baseline of the portfolio before the major interactive overhaul. The focus was on establishing a clean, professional, and well-organized presentation with high-quality visuals and foundational animations.

- **Skills Section Revamp:**

  - **High-Quality Icons:** Replaced old, inconsistent logos with a curated set of high-quality SVGs from `simple-icons` and custom components, ensuring a professional and polished look.
  - **Categorization:** Skills were reorganized into three clear, logical categories: "Data Science," "Frontend Development," and "Tools & Platforms," making the information easier to digest.

- **UI & Animation Enhancements:**

  - **Moving Banner Animation:** The `InfiniteScroller` component was implemented to create dynamic, moving "ribbons" of skill logos on both the homepage's skills section and the dedicated skills page. This adds a sense of life and energy to what would otherwise be a static list.
  - **Multi-Page Navigation:** A proper top navigation bar was implemented, which gracefully collapses into a space-saving hamburger menu (`MobileNav`) on smaller devices, ensuring a good user experience across all screen sizes.
  - **Particle Clutter Fix:** A hard limit was introduced on the number of particles that could be rendered at once in the easter egg, preventing performance issues and visual clutter.

- **Simple Easter Egg (Pre-Gamification):**

  - The "Quantum Conundrum" was a basic feature at this stage. A single button press would immediately show either an "Alive" or "Decohered" cat outcome with a simple particle effect. There was no gameplay, timer, score, or difficulty.
  - The resulting pet was not interactive. It would appear on the screen and perform a simple CSS animation in place (`popper` or `ghost`) before disappearing after a fixed time.

- **SEO & Foundational Work:**
  - **Google Indexing:** The main webpage was submitted to the Google Index.
  - **Basic Metadata:** The site had foundational metadata but lacked the more advanced Open Graph and Twitter-specific tags needed for rich social media sharing.
  - The project was configured with `next-sitemap` to auto-generate `sitemap.xml` and `robots.txt` for better search engine crawlability.
