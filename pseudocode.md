# Quantalink Portfolio - Pseudocode & Architecture Overview

This document outlines the high-level structure and logic of the key interactive components of the Next.js portfolio application, reflecting the final implementation.

## 1. Global State Management (`src/lib/pet-state.ts`)

- **Purpose:** A global state store (using Zustand) to manage the page pet's existence and initial animation coordinates.
- **State:**
  - `pet`: object | null
    - `type`: 'cat' | 'ghost'
    - `startX`: number (initial screen X position)
    - `startY`: number (initial screen Y position)
- **Actions:**
  - `setPet(type, startX, startY)`: Sets the pet's data, spawning it.
  - `clearPet()`: Resets the pet state to `null`, removing it.

## 2. The Quantum Conundrum Mini-Game (`src/components/easter-egg.tsx`)

<<<<<<< HEAD
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
=======
- **Purpose:** A client-side, fully-fledged mini-game that determines which page pet spawns.
- **State:**
  - `gameState`: 'idle' | 'playing' | 'won' | 'lost'
  - `difficulty`: number (current level)
  - `score`: number (anomalies clicked)
  - `anomalies`: Array<object> (anomalies on screen)
  - `timeLeft`: number
  - `isResultIconVisible`: boolean (controls visibility of the result icon post-game)
>>>>>>> 4c6b5a5 (even more add more changes we made and also update pseudocode.md)

- **Game Logic Flow:**
  1.  **`handleStart()`:**
      - Set `gameState` to 'playing'.
      - Reset `score`, `timeLeft` based on `difficulty`.
      - Start the countdown timer `setInterval`.
      - Call `spawnAnomaly()` to create the first target.

  2.  **`spawnAnomaly()`:**
      - Creates a new anomaly object with a **unique ID** (`Date.now() + Math.random()`).
      - Adds the new anomaly to the `anomalies` state array.

  3.  **`handleAnomalyClick(anomalyId)`:**
      - Increment `score`.
      - Remove the clicked anomaly from the `anomalies` array.
      - Trigger a particle effect at the anomaly's position.
      - **Check Win Condition:** If `score >= requiredScore`:
          - Call `handleEndGame(true)` (win).
      - Else:
          - Call `spawnAnomaly()` to create the next target.

  4.  **Countdown Timer (`useEffect`):**
      - Decrements `timeLeft` every second.
      - **Check Lose Condition:** If `timeLeft <= 0`:
          - Call `handleEndGame(false)` (loss).

  5.  **`handleEndGame(didWin)`:**
      - Clear the countdown timer interval.
      - Set `gameState` to 'won' or 'lost'.
      - Set `isResultIconVisible` to `true`.
      - If `didWin`:
          - Increment `difficulty`.
          - **Pet Spawning (Delayed):**
              - `setTimeout(250ms)`:
                  - Get the screen coordinates of the result `Cat` icon.
                  - Call `setPet('cat', x, y)` from the global pet store.
                  - Set `isResultIconVisible` to `false`.
      - Else (`didWin === false`):
           - **Pet Spawning (Delayed):**
              - `setTimeout(250ms)`:
                  - Get the screen coordinates of the result `Ghost` icon.
                  - Call `setPet('ghost', x, y)` from the global pet store.
                  - Set `isResultIconVisible` to `false`.
  
  6.  **`handleReset()`:**
      - Call `clearPet()` from the global pet store.
      - Reset all game states to initial values (`gameState` to 'idle').

## 3. The Interactive Page Pet (`src/components/page-pet.tsx`)

- **Purpose:** A client-side component that renders the roaming pet based on the global state.
- **State:**
  - `pos`: { x, y } (current position)
  - `vel`: { x, y } (current velocity)
  - `target`: { x, y } (destination for movement)
  - `petState` (for ghost): 'stalking' | 'hiding' | 'swooshing'
  - `showMeow` (for cat): boolean

- **Animation & Logic:**

  1.  **Initial Spawn:**
      - The component renders when the global `pet` state is not `null`.
      - An outer `div` has a `fly-in` animation.
      - This animation uses CSS variables (`--start-x`, `--start-y`) which are set inline based on the `pet.startX` and `pet.startY` from the global state.
      - This creates the effect of the pet flying from the result card to its initial position.

  2.  **Cat Logic (`useEffect` loop):**
      - **Movement:**
          - If cat is too far from its `target`, update `vel` to move towards it (avoiding the cursor).
          - If cat is close to its `target`, pick a new random `target` on the screen.
          - Apply velocity to `pos`.
          - Use `requestAnimationFrame` for a smooth animation loop.
      - **Interaction:**
          - `onMouseEnter`: Set `showMeow` to `true`.
          - `onMouseLeave`: Set `showMeow` to `false`.
          - `onClick`: Trigger `showMeow` for a short duration.

  3.  **Ghost Logic (`useEffect` loop):**
      - **State Machine:**
          - **`stalking` state:**
              - Move slowly towards a random `target`.
              - After a random duration (8-15s), switch to `hiding` or `swooshing`.
          - **`hiding` state:**
              - Become invisible (`opacity: 0`).
              - After a random duration (2-4s), switch back to `stalking`.
          - **`swooshing` state:**
              - Pick a new random `target` across the screen.
              - Apply a large, single burst of `vel` towards the target.
              - The ghost dashes rapidly across the screen.
              - After the swoosh duration (3s), switch back to `stalking`.
      - **Animation:** The `requestAnimationFrame` loop applies the current `vel` to the `pos` to render the ghost's movement.
