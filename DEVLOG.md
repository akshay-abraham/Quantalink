# Quantalink Portfolio - Development Log

## Version 2.4: Animation & SEO Polish (`2a5d934`)

This version focused on refining the user experience through smoother animations, improved game feel, and a final, comprehensive SEO overhaul to maximize the portfolio's visibility and social media presence.

---

### 🔹 Animation & Interaction Refinements

*   **Smoother Ghost Movement:** The ghost's AI and physics were significantly refined to make its movement feel less chaotic and more deliberate.
    *   **Longer, Graceful Dashes:** The "swoosh" animation was smoothed out by reducing friction and increasing its duration to `3000ms`, allowing the ghost to perform long, unsettling glides across the screen.
    *   **Less Frequent Direction Changes:** The time the ghost spends in its "stalking" state was increased to a random duration between 8 and 15 seconds, making its behavior feel more patient and menacing.

*   **Persistent Cat Interaction:** The cat's interaction model was finalized.
    *   **No Dismiss on Click:** The `onClick` dismiss handler was removed, making the cat a persistent companion until the game is played again.
    *   **"Meow" on Hover & Click:** The "Meow!" speech bubble now appears on both hover and click, making the cat more consistently responsive and interactive.

*   **Improved Game Feel:**
    *   **Larger Reset Button:** The "Reset" button in the game's failure state was enlarged using the `size="lg"` prop for better usability and a clearer call to action.

---

### 🔹 SEO Enhancements

*   **Twitter Card Metadata:** Added comprehensive Open Graph and Twitter-specific meta tags (`twitter:card`, `twitter:title`, etc.) to the root layout. This ensures that links shared on social media generate rich, properly formatted preview cards.
*   **Optimized Page Titles:** The titles for the `/about`, `/projects`, and `/skills` pages were made more descriptive and keyword-rich to improve their visibility and ranking in search engine results.

---

## Version 2.3: The Quantum Pet Update (`b013a94`)

Version 2.3 marks a significant evolution of the portfolio's interactive elements, transforming the "Quantum Conundrum" from a simple thought experiment into a fully-fledged mini-game and introducing a persistent, interactive "page pet" whose existence is determined by the game's outcome.

---

### 🔹 Major Feature: The Quantum Conundrum Mini-Game

The original Easter Egg was a simple button press with a random outcome. V2.3 gamifies this concept entirely.

*   **New Gameplay Loop:**
    *   **State Machine:** A new game state machine (`idle`, `playing`, `won`, `lost`) was implemented to manage the game flow.
    *   **Objective:** Users must "stabilize the quantum field" by clicking on `QuantumAnomaly` targets that appear randomly on the screen.
    *   **Progression:** A progress bar and a countdown timer create a sense of urgency. The number of anomalies to collect and the time limit are determined by the current difficulty level.
    *   **Win/Loss Conditions:** Successfully collecting all anomalies results in a "win" state, while running out of time results in a "loss" (or "meltdown").

*   **Progressive Difficulty:**
    *   A dynamic difficulty system was implemented to create a compelling challenge.
    *   **Linear Increase (Levels 1-3):** For the first three wins, the difficulty increases linearly, requiring more anomalies to be collected in less time.
    *   **Compound Increase (Level 4+):** After level 3, the difficulty increases at a compound rate but is capped to ensure the game remains challenging yet fair, rewarding dedicated players.

*   **Richer UI & Animations:**
    *   A dedicated game interface was built, including a progress bar, level indicator, and timer.
    *   Particle effects were added for when an anomaly is successfully clicked, providing satisfying visual feedback. The animation was later refined to be less intense for a cleaner look.
    *   The win/loss screens are more dramatic, setting the stage for the pet spawn.

*   **Bug Fix: Duplicate Keys:** Resolved a critical bug where anomalies could spawn with duplicate React keys, which caused console errors. The key generation logic was updated to use `Date.now() + Math.random()` for guaranteed uniqueness.

---

### 🔹 Major Feature: Interactive & Persistent Page Pets

The most significant addition in v2.3 is the introduction of a roaming "page pet," which is spawned directly from the outcome of the Quantum Conundrum game.

*   **Seamless "Fly-Out" Transition:**
    *   An advanced animation system was engineered to create the illusion that the result icon (Cat or Ghost) literally flies out of the result card and becomes the interactive page pet.
    *   **Mechanism:** This was achieved by capturing the screen coordinates of the result icon, passing them to a new global pet state manager (`usePetStore`), and using a dynamic CSS `fly-in` animation powered by CSS variables to animate the pet from that starting position.
    *   The result icon is hidden the moment the page pet spawns (controlled by `isResultIconVisible` state), ensuring only one instance is visible at a time for a seamless effect.

*   **Persistent & Interactive Cat:**
    *   **Behavior:** The "Alive" cat now roams the page, intelligently avoiding the user's cursor. It remains on the page indefinitely until the game is played again.
    *   **Interaction:** When the user hovers over or clicks the cat, a "Meow!" speech bubble appears, adding a layer of charming interactivity.

*   **Terrifyingly "Swooshing" Ghost:**
    *   **Behavior Overhaul:** The "Decohered" ghost's AI was completely rewritten to be genuinely spooky.
    *   **State Machine:** The ghost now operates on a state machine, switching between three distinct modes:
        1.  `stalking`: Drifts slowly and menacingly.
        2.  `hiding`: Briefly turns invisible.
        3.  `swooshing`: Executes a sudden, high-velocity dash to a random point on the screen.
    *   **Smoother Motion:** The animation physics were refined to make its movements, especially the "swoosh," feel smoother and more deliberate, enhancing the unsettling vibe.

---

## Version 2.2: Pre-Gamification (`ebc70a1`)

This version represents the baseline before the major interactive overhaul.

*   **Simple Easter Egg:** The "Quantum Conundrum" was a basic feature. A single button press would immediately show either an "Alive" or "Decohered" cat outcome with a simple particle effect. There was no gameplay, timer, or difficulty.
*   **Static Pet:** The resulting pet was not interactive. It would appear on the screen and simply animate in place (`popper` or `ghost` animation) without roaming or responding to user input. The pet would also disappear after a fixed time.
*   **Basic SEO:** The site had foundational metadata but lacked the more advanced Open Graph and Twitter-specific tags needed for rich social media sharing.
