<<<<<<< HEAD
# **Full Beta Version:** [https://betaakshayabraham.vercel.app/skills](https://betaakshayabraham.vercel.app/skills)

Production: **[https://akshayabraham.vercel.app](https://akshayabraham.vercel.app)**

# Quantalink v2.2 Dev Log

## ✅ Updates: v2.1 → v2.2

### **Skills Section Revamp**

- Replaced old, broken programming language logos with **high-quality SVGs** from [SimpleIcons](https://simpleicons.org).
- Reorganized skills into three clear categories:
  1. **Data Science**
  2. **Frontend Development**
  3. **Tools & Platforms**

---

### **Animation & UI Enhancements**

- Fixed the **particle clutter issue** by introducing a hard limit on particle count.
- Added **moving banner animations** (like news channels or tech websites) to:
  - Skills Page
  - Skills Section
- Implemented **multi-page navigation** with a top menu bar that gracefully **collapses into a hamburger menu** on mobile devices.

---

### **SEO & Accessibility**

- Added the **main webpage** to **Google Index** for improved discoverability.

---

## 🚧 Work in Progress for v2.3

### **Responsive Layout**

- Optimize **horizontal space usage** on desktop for a more polished UI.
- Fix spacing issues when the **hamburger menu** hides on mobile devices.
- Redesign hamburger menu with a **minimal acrylic style**.

---

### **Performance & Animation**

- Maintain **high-end animations** on desktop while optimizing performance for Android devices.
- Add **interactive info elements** to explain the **quantum-inspired background animations**.
- Introduce a **new glow animation** moving along the edges of each project box in:
  - Projects Pane
  - Projects Page

---

### **SEO & Branding**

- Further **SEO improvements** for better visibility.
- Friendlier **README** with:
  - Behind-the-scenes insights
  - Physics inspiration behind each design element
- Update **favicon** with a fresh, modern look.

---

## [Checkout Beta v2.2](https://github.com/akshay-abraham/Quantalink/tree/beta)
=======
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

# Quantalink Portfolio: A Deep Dive
**[https://akshayabraham.vercel.app](https://akshayabraham.vercel.app)**

<<<<<<< HEAD
- **v2 → v2.1 (Quantalink Update)**: Rebranding, acrylic UI overhaul, SEO optimization, gamified easter egg, official icons, performance fixes, local assets, structured metadata, sitemap automation, full code documentation.
=======
This document is a comprehensive guide to the architecture, design philosophy, and technical implementation of the Quantalink portfolio. It goes beyond a simple feature list to explain the *why* behind the user experience—connecting design choices to their inspirational roots in theoretical physics and modern UI/UX principles.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

---

## 🔹 Core Philosophy: Science as an Interface

The central thesis of this portfolio is to create an interactive experience that *feels* like the subject matter it represents: theoretical physics. The goal was to move beyond a static "digital resume" and build an environment that is clean, professional, and imbued with a sense of wonder, interactivity, and subtle complexity.

<<<<<<< HEAD
- **Dedicated Pages**: `/projects` and `/skills` for structured content. _(v2 change)_
- **UI Overhaul**: Canvas-based animated background with collisions, Acrylic effects (replacing Mica in v2.1), ripple-glow buttons. _(v2 + v2.1 change)_
- **Interactive Elements**: Easter egg → full mini-game, 3D tilts, particle effects, adaptive animations. _(v2 + v2.1 change)_
- **Performance & SEO**: Optimized animations, metadata, sitemap, robots.txt, structured data for Google. _(v2.1 change)_

The final production site: **[https://akshayabraham.vercel.app](https://akshayabraham.vercel.app)**
=======
Every element, from the animated background to the "Quantum Conundrum" game, is designed to be a conversation starter, reflecting a passion for science, technology, and meticulous design.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

---

## 🔹 The User Experience: A Guided Tour

The UI/UX is built on a foundation of minimalism, focus, and progressive disclosure. The user is guided through a narrative, with interactive elements designed to delight and engage without overwhelming.

### **1. The Ambiance: A Living Quantum Foam**

<<<<<<< HEAD
- Single-column, centered layout for focus.
- Fully responsive across devices.
- Dedicated `/projects` & `/skills` pages for full content access. _(v2 change)_
=======
The first thing a user experiences is not a static background, but a dynamic, living canvas.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

*   **The Physics Behind It (`AnimatedBackground`):** The background is a direct visualization of **Quantum Electrodynamics (QED)**, the theory of how light and matter interact.
    *   **Particles:** The drifting points of light represent charged particles (like electrons and positrons) existing in a quantum field. Their gentle, random motion evokes the constant, subtle energy of the universe at a subatomic level.
    *   **Photon Lines:** The faint, wavy lines that occasionally flash between particles represent the exchange of **virtual photons**. In QED, forces are transmitted by exchange particles. These lines visualize the electromagnetic force being carried between the charged particles, causing them to attract or repel.
    *   **Vacuum Fluctuations:** The pairs of particles that spontaneously appear and disappear represent **vacuum fluctuations** or **virtual particle pairs**. According to quantum field theory, "empty" space is not empty at all, but a bubbling foam of particle-antiparticle pairs that pop into existence for fleeting moments before annihilating each other. The animation simulates this by spawning short-lived pairs, adding to the dynamic and "alive" feel of the background.
*   **The UX Purpose:** This is not just decoration. It immediately establishes the portfolio's theme, creating an immersive, high-tech ambiance that is visually engaging and thematically relevant. It runs at a capped `27fps` with adaptive particle density to ensure smooth performance on all devices.

### **2. The UI Aesthetic: Acrylic Glass & Light**

<<<<<<< HEAD
- **Font**: Inter — clean & modern.
- **Spacing**: Generous vertical space for clarity.
- **Separators**: `<Separator />` for visual breaks.
=======
The entire UI is built on a custom "Acrylic" design system, inspired by modern operating systems.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

*   **The Design:** Components like the link cards, project cards, and dialogs have a semi-transparent background with a subtle background blur (`bg-card/30 backdrop-blur-md`).
*   **The UX Purpose:** This creates a sense of depth and hierarchy. The content feels like it's floating on a pane of glass just above the quantum foam, reinforcing the futuristic, layered aesthetic. The primary color, Teal, is used as an accent for interactive elements, guiding the user's eye without being distracting.

### **3. The Introduction: A Cinematic Entrance (`ProfileSection`)**

<<<<<<< HEAD
- **Background Animation**:

  - Live canvas with particles, collisions. _(v2 change)_
  - Adaptive density & stability improvements in v2.1.

- **Acrylic Effect (v2.1)**: Replaced Mica with clearer, modern acrylic look across panels & cards.

- **Performance Optimization**: Smoother loops for low-end devices. _(v2 + v2.1)_
=======
The user's first interaction with the content is designed to be smooth and focused.

*   **The Animation:** All elements—the avatar, name, and tagline—use a staggered `fade-in-up` animation, triggered by the `useInView` hook. This ensures the animation only plays when the user sees the section.
*   **The Hover Effects:** The avatar has a subtle pulse and glow effect on hover, inviting interaction and adding a layer of "game feel."
*   **The UX Purpose:** This cinematic entrance avoids jarring the user with instantly-present content. It guides their focus naturally from the avatar to the name and tagline, creating a polished and professional first impression.

### **4. The Core Interaction: 3D Tilt & Glow Cards (`LinkCards`)**

The primary navigation links are not static buttons but highly interactive objects.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

*   **The Physics Behind It:** The 3D tilt effect, which responds to the user's cursor position, is a subtle nod to the **Observer Effect** in quantum mechanics—the idea that the act of observation can influence a system. Here, the user's "observation" (their cursor) directly influences the card's state.
*   **The Implementation:** This is achieved by calculating the cursor's position relative to the card's center and applying a `perspective` and `rotateX/Y` CSS transform. A radial gradient, whose position is also controlled by the cursor, creates a "glow" that appears to follow the user's mouse.
*   **The UX Purpose:** This turns simple navigation into a tactile, engaging experience. It makes the interface feel responsive and alive, rewarding user curiosity with satisfying visual feedback.

### **5. The Grand Finale: The Quantum Conundrum Game (`EasterEgg`)**

<<<<<<< HEAD
- **Central Avatar**: Local `/public/profile.webp` (v2.1 change) for faster loading.
- **Name & Tooltip**: Full name on hover.
- **Entrance Animations**: Fade + slide transitions.

---

## Link Cards

- **Design**: Acrylic panels (v2.1).
- **Hover Effects**: 3D tilt, glow, ripple-click feedback. _(v2 change)_
- **Sequential Animation**: Staggered card entry.

---

## Content Sections

### Skills Section

- Dedicated `/skills` page for categorized skills _(v2 change)_.
- Official tech logos (C++, Python, React, etc.) added in v2.1 for professional polish.
- Modal details on skill click _(v2 change)_.

---

### Projects Section

- `/projects` page lists all projects _(v2 change)_.
- Updated Quantalink project links in v2.1.

---

## Easter Egg – Quantum Conundrum

- **v2**: Live vs. ghost cat with playful animations.
- **v2.1**: Full mini-game with start screen, wave-function collapse animation, progress bar, dramatic outcomes.

---

## Footer

- Minimalist, dynamic copyright.

---

## Performance & SEO _(v2.1)_

- Rich metadata, canonical URLs, sitemap.xml, robots.txt.
- Structured Data (JSON-LD) for Google indexing.
- On-page `<h1>` SEO optimization.
=======
This is the portfolio's centerpiece—a feature that fully embodies the "Science as an Interface" philosophy.

*   **The Physics Behind It:** The game is a direct gamification of the **Schrödinger's Cat** thought experiment.
    *   **Superposition:** Before the game is played, the cat's fate is unknown—it is in a "superposition" of states.
    *   **Observation:** The act of playing the game—collecting the "Quantum Anomalies"—is the "observation."
    *   **Wave Function Collapse:** The moment the game ends (win or lose), the wave function collapses, and reality is forced to choose one of two definite outcomes: the cat is either "Alive" (a win) or "Decohered" (a loss).
*   **The Gamification & UX:**
    *   **Progressive Difficulty:** The game starts easy and becomes progressively harder, rewarding skill and persistence. This makes it a compelling challenge rather than a simple one-off gimmick.
    *   **Responsive Feedback:** Clicking an anomaly triggers a satisfying particle burst. A progress bar and timer create urgency and provide clear feedback on the player's performance.
    *   **The "Fly-Out" Transition:** This is the most complex animation in the app. The icon from the result card (Cat or Ghost) appears to seamlessly lift off the card and become the roaming page pet. This is achieved by:
        1.  Capturing the screen coordinates of the result icon.
        2.  Passing these coordinates to a global state manager.
        3.  Using a dynamic CSS animation with CSS variables to animate the pet from that starting position.
        4.  Hiding the original icon at the exact moment the pet spawns.
    *   **Persistent, Interactive Pets:** The resulting pet is not just a temporary animation. It becomes a persistent page companion until the game is played again. The "Alive" cat playfully roams and "meows" on hover/click. The "Decohered" ghost has a complex AI, alternating between slow, menacing stalking, brief invisibility, and sudden, high-speed "swooshes" across the screen. This makes the outcome of the game feel meaningful and impactful.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

---

## Technical Stack

<<<<<<< HEAD
- **Framework**: Next.js
- **UI Library**: React + Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + Canvas
- **Deployment**: Vercel

---

## Code Quality _(v2.1)_

- JSDoc comments across all files.
- Cleanup of unused assets & data sources.

---

## [Pseudocode](pseudocode.md)
=======
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Library**: React, ShadCN UI
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion, CSS Transitions, Canvas API
*   **Deployment**: Vercel

---

## Code Quality & SEO

*   **Documentation**: All components and major functions are documented with JSDoc comments. `pseudocode.md` and `DEVLOG.md` provide high-level architectural overviews.
*   **SEO**: The application is fully optimized for search engines with:
    *   Rich metadata (Open Graph, Twitter Cards).
    *   A `sitemap.xml` and `robots.txt` generated on build.
    *   Structured Data (JSON-LD) for enhanced Google indexing.
    *   Semantic HTML and keyword-optimized page titles.
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

---

## License

GNU GENERAL PUBLIC LICENSE v3 © 2025 Akshay Abraham
<<<<<<< HEAD

---
=======
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)
