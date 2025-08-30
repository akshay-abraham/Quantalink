# Quantalink Portfolio - Development Log

## Version 2.3: The Quantum Pet Update (`b013a94`)

Version 2.3 marks a significant evolution of the portfolio's interactive elements, transforming the "Quantum Conundrum" from a simple thought experiment into a fully-fledged mini-game and introducing a persistent, interactive "page pet" whose existence is determined by the game's outcome.

---

### 🔹 Major Feature: The Quantum Conundrum Mini-Game

The original Easter Egg was a simple button press with a random outcome. V2.3 gamifies this concept entirely.

*   **New Gameplay Loop:**
    *   **Start Screen:** The game now begins with an introduction and a "Start Experiment" button.
    *   **Objective:** Users must "stabilize the quantum field" by clicking on `Quantum Anomaly` targets that appear randomly on the screen.
    *   **Progression:** A progress bar and a countdown timer create a sense of urgency. The number of anomalies to collect and the time limit are determined by the current difficulty level.
    *   **Win/Loss Conditions:** Successfully collecting all anomalies results in a "win" state, while running out of time results in a "loss" (or "meltdown").

*   **Progressive Difficulty:**
    *   A dynamic difficulty system was implemented to create a compelling challenge.
    *   **Linear Increase (Levels 1-3):** For the first three wins, the difficulty increases linearly, requiring more anomalies to be collected in less time.
    *   **Compound Increase (Level 4+):** After level 3, the difficulty increases at a compound rate but is capped to ensure the game remains challenging yet fair, rewarding dedicated players.

*   **Richer UI & Animations:**
    *   A dedicated game interface was built, including a progress bar, level indicator, and timer.
    *   Particle effects were added for when an anomaly is successfully clicked, providing satisfying visual feedback.
    *   The win/loss screens are more dramatic, setting the stage for the pet spawn.

*   **Bug Fix: Duplicate Keys:** Resolved a critical bug where anomalies could spawn with duplicate React keys, which caused console errors. The key generation logic was updated to use `Date.now() + Math.random()` for guaranteed uniqueness.

---

### 🔹 Major Feature: Interactive & Persistent Page Pets

The most significant addition in v2.3 is the introduction of a roaming "page pet," which is spawned directly from the outcome of the Quantum Conundrum game.

*   **Seamless "Fly-Out" Transition:**
    *   An advanced animation system was engineered to create the illusion that the result icon (Cat or Ghost) literally flies out of the result card and becomes the interactive page pet.
    *   **Mechanism:** This was achieved by capturing the screen coordinates of the result icon, passing them to a new global pet state manager, and using a dynamic CSS `fly-in` animation powered by CSS variables to animate the pet from that starting position.
    *   The result icon is hidden the moment the page pet spawns, ensuring only one instance is visible at a time for a seamless effect.

*   **Persistent & Interactive Cat:**
    *   **Behavior:** The "Alive" cat now roams the page, intelligently avoiding the user's cursor.
    *   **Interaction:** When the user hovers over or clicks the cat, a "Meow!" speech bubble appears, adding a layer of charming interactivity.
    *   **Persistence:** The cat is no longer dismissed on click and remains on the page until the user plays the game again.

*   **Terrifyingly "Swooshing" Ghost:**
    *   **Behavior Overhaul:** The "Decohered" ghost's AI was completely rewritten to be genuinely spooky.
    *   **State Machine:** The ghost now operates on a state machine, switching between three distinct modes:
        1.  `stalking`: Drifts slowly and menacingly.
        2.  `hiding`: Briefly turns invisible.
        3.  `swooshing`: Executes a sudden, high-velocity dash to a random point on the screen.
    *   **Smoother Motion:** The animation physics were refined to make its movements, especially the "swoosh," feel smoother and more deliberate, enhancing the unsettling vibe.

---

### 🔹 UI & Animation Refinements

General UI and animation smoothing was performed across the application to enhance the overall user experience.

*   **Smoother Easing Curves:** The primary `fade-in-up` animation was updated to use a more graceful `cubic-bezier` timing function, making element entrances feel less abrupt and more professional.
*   **Refined Animation Durations:** Transition durations were tweaked across several components to create a more cohesive and deliberate feel.
*   **Larger Reset Button:** The "Reset" button in the game was enlarged for better usability on all devices.

---

### 🔹 SEO Enhancements

*   **Twitter Card Metadata:** Added comprehensive Open Graph and Twitter-specific meta tags (`twitter:card`, `twitter:title`, etc.) to the root layout. This ensures that links shared on social media generate rich, properly formatted preview cards.
*   **Optimized Page Titles:** The titles for the `/about`, `/projects`, and `/skills` pages were made more descriptive and keyword-rich to improve their visibility and ranking in search engine results.

---
