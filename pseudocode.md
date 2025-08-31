# Quantalink Portfolio - Pseudocode & Architecture Overview

This document outlines the high-level structure and logic of the key interactive components of the Next.js portfolio application, reflecting the final implementation.

## 1. Global State Management (`src/lib/pet-state.ts`)

- **Purpose:** A global state store (using a simple pub/sub model) to manage the page pet's existence and initial animation coordinates. This allows the pet to persist across all pages.
- **State:**
  - `pet`: object | null
    - `type`: 'alive' | 'ghost'
    - `startX`: number (initial screen X position for the fly-out animation)
    - `startY`: number (initial screen Y position for the fly-out animation)
- **Actions:**
  - `setPet(type, startX, startY)`: Sets the pet's data, which triggers the `GlobalPetRenderer` to render the pet and start the animation.
  - `getSnapshot()`: Returns the current state.
  - `subscribe(listener)`: Allows components to listen for state changes.

## 2. The Quantum Conundrum Mini-Game (`src/components/easter-egg.tsx`)

- **Purpose:** A client-side, fully-fledged mini-game that determines which page pet spawns.
- **State:**

  - `gameState`: 'idle' | 'playing' | 'revealing' | 'result' | 'failed'
  - `stats`: { alive: number, ghost: number, plays: number } (loaded from localStorage)
  - `difficulty`: { time: number, anomalies: number, spawnRate: number }
  - `anomaliesToClick`: number (remaining targets)
  - `timeLeft`: number
  - `isResultIconVisible`: boolean (controls visibility of the result icon post-game)
    > > > > > > > 4c6b5a5 (even more add more changes we made and also update pseudocode.md)
  - `anomalies`: Array<object> (the anomaly targets currently on screen)
  - `particleEffects`: Array<object> (for click feedback)
  - `isResultIconVisible`: boolean (controls the visibility of the result icon post-game to enable the fly-out animation)

- **Game Logic Flow:**

  1.  **`useEffect` on Mount:**

      - Load `stats` from `localStorage` to track persistence.
      - Calculate initial `difficulty` based on loaded stats.

  2.  **`startExperiment()`:**

      - Clear any existing `pet` from the global state.
      - Update `stats` (increment `plays`) and save to `localStorage`.
      - Calculate new `difficulty` based on the new play count.
      - Reset `anomaliesToClick`, `timeLeft`, `anomalies`.
      - Set `gameState` to 'playing'.
      - Start the countdown `timerRef` (`setInterval`).
      - Start the `anomalySpawnerRef` `setInterval` based on `difficulty.spawnRate`.
      - Call `spawnAnomaly()` to create the first target immediately.

  3.  **`spawnAnomaly()`:**

      - Creates a new anomaly object with a **unique ID** (`Date.now() + Math.random()`), a random position, icon, and color.
      - Adds the new anomaly to the `anomalies` state array.
      - To prevent overflow, if `anomalies.length > 7`, it removes the oldest one.

  4.  **`handleAnomalyClick(id, x, y)`:**

      - Decrement `anomaliesToClick`.
      - Remove the clicked anomaly from the `anomalies` array.
      - Trigger a particle burst effect at the click coordinates (`x`, `y`).
      - **Check Win Condition:** If `anomaliesToClick <= 0`:
        - Call `observe()` to start the win sequence.
      - Else:
        - Call `spawnAnomaly()` to keep the game board populated.

  5.  **Countdown Timer (`useEffect` with `timeLeft`):**

      - `timerRef` `setInterval` decrements `timeLeft` every second.
      - **Check Lose Condition:** If `timeLeft <= 1`:
        - Clean up all timers (`cleanupTimers()`).
        - Set `gameState` to 'failed'.

  6.  **`observe()` (Win Sequence):**

      - Cleanup all timers.
      - Set `gameState` to 'revealing'.
      - `setTimeout(2500ms)` to allow for the "Wave Function Collapsing..." animation:
        - Randomly determine the `result` ('alive' or 'ghost').
        - Update `stats` with the result and save to `localStorage`.
        - Set `catState` to the `result`.
        - Set `isResultIconVisible` to `true` (to prepare for the fly-out).
        - Set `gameState` to 'result'.
        - **Pet Spawning (Delayed Fly-Out Animation):**
          - `setTimeout(250ms)`:
            - Get the screen coordinates of the result icon (`Cat` or `Ghost`) using `resultIconRef.current.getBoundingClientRect()`.
            - Call `setPet(result, x, y)` from the global pet store, passing the icon's coordinates.
            - Set `isResultIconVisible` to `false` to hide the original icon, creating the illusion it "flew off" the card.

  7.  **`reset()`:**
      - Called by the "Run New Experiment" button.
      - Cleans up timers.
      - Resets `gameState` to 'idle' and `catState` to `null`.
      - Does **not** clear the pet from the global state, allowing it to persist.

## 3. The Interactive Page Pet (`src/components/page-pet.tsx`)

- **Purpose:** A client-side component that renders the roaming pet based on the global state. It's rendered via a portal into the root layout.
- **State:**

  - `position`: { x, y } (current position on screen)
  - `velocity`: { vx, vy } (current velocity for physics-based movement)
  - `isAnimatingIn`: boolean (true for the first second to play the fly-in animation)
  - `showMeow`: boolean (for the cat's interaction)
  - `isVisible`: boolean (for the ghost's fade in/out)

- **Animation & Logic:**

  1.  **Initial Spawn (`useEffect` on mount):**

      - The component is rendered by `GlobalPetRenderer` when the global `pet` state is not `null`.
      - An outer `div` has the `animate-fly-in` class.
      - This animation uses CSS variables (`--start-x`, `--start-y`) which are set inline based on the `pet.startX` and `pet.startY` from the global state.
      - A timeout sets `isAnimatingIn` to `false` after 1 second, switching from the initial CSS animation to the physics-based `requestAnimationFrame` loop.

  2.  **Cat Logic (`requestAnimationFrame` loop, when `type === 'alive'`):**

      - **Movement:**
        - Get the current mouse position.
        - If the distance to the mouse is `> 50px`, apply a small force towards the cursor (`vx += dx * 0.0005`). This makes it gently follow.
        - Apply friction (`vx *= 0.98`) to slow it down naturally.
        - Enforce a `maxSpeed` to prevent it from moving too fast.
        - Apply velocity to the `position`.
        - Bounce off the edges of the window by reversing velocity.
      - **Interaction:**
        - `onMouseEnter` or `onClick` on the pet's `div` triggers `setShowMeow(true)`.
        - A `useEffect` hook with a `setTimeout` hides the meow bubble after 1 second.
        - The click handler that used to dismiss the cat is **removed**.

  3.  **Ghost Logic (`useEffect` and timeouts, when `type === 'ghost'`):**
      - The ghost uses a state machine based on timeouts, not a physics loop.
      - `runGhostAI()` is called when the component is ready.
        1. **Fade Out:** `setIsVisible(false)`.
        2. **Teleport:** `setTimeout(1500ms)`:
           - Calculate a new random `(x, y)` position on the screen.
           - Set the ghost's `position` to these new coordinates.
        3. **Fade In:** `setIsVisible(true)`.
        4. **Schedule Next Teleport:** `setTimeout(random(4-9 seconds))`:
           - Call `runGhostAI()` again to loop the behavior.

## 4. Infinite Scroller (`src/components/infinite-scroller.tsx`)

- **Purpose:** Creates a seamless, looping "ribbon" of elements.
- **Logic (`useEffect`):**
  1.  When the component mounts or its children change, it runs the `addAnimation` function.
  2.  `addAnimation` gets all direct children of the inner `<ul>`.
  3.  It **clones each child** and appends the clone to the end of the `<ul>`.
  4.  The clones are marked with `aria-hidden="true"` for accessibility.
  5.  The `scroller-container` has a CSS keyframe animation (`scrolling-logos`) that translates it by `-50%`. Because the content is now doubled, this creates a perfect, seamless loop.
  6.  CSS variables (`--animation-duration`, `--animation-direction`) are set on the container to control speed and direction from props.
  7.  `pauseOnHover` is handled by a simple CSS `hover` selector in the `<ul>`'s class list.
