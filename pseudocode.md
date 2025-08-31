# 🌌 Quantalink Portfolio — Pseudocode & Architecture Overview

---

## 🗂 **1. Global State Management** (`src/lib/pet-state.ts`)

### **Purpose**

A global state store using a **lightweight pub/sub model** to manage page pet existence & fly-in animation coordinates. Enables persistence across pages.

### **State Variables**

| Variable           | Type               | Description                                    |
| ------------------ | ------------------ | ---------------------------------------------- |
| `pet`              | object             | Holds pet type & initial coordinates           |
| `type`             | 'alive' \| 'ghost' | Determines pet variant                         |
| `startX`, `startY` | number             | Initial spawn coordinates for fly-in animation |

### **Actions**

- `setPet(type, startX, startY)`: Spawns pet with given type & position.
- `getSnapshot()`: Returns current state snapshot.
- `subscribe(listener)`: Adds listener for state changes.

---

## 🎮 **2. Quantum Conundrum Mini-Game** (`src/components/easter-egg.tsx`)

### **Purpose**

A fully client-side mini-game deciding which page pet spawns post-game.

### **State Variables**

| Variable              | Type/Values                                                | Description                           |
| --------------------- | ---------------------------------------------------------- | ------------------------------------- |
| `gameState`           | 'idle' \| 'playing' \| 'revealing' \| 'result' \| 'failed' | Game lifecycle stages                 |
| `stats`               | { alive, ghost, plays }                                    | Persistent stats (via `localStorage`) |
| `difficulty`          | { time, anomalies, spawnRate }                             | Dynamic difficulty scaling            |
| `anomaliesToClick`    | number                                                     | Remaining anomalies to clear          |
| `timeLeft`            | number                                                     | Remaining seconds in round            |
| `anomalies`           | Array<object>                                              | Active anomalies on screen            |
| `particleEffects`     | Array<object>                                              | For click feedback bursts             |
| `isResultIconVisible` | boolean                                                    | Controls fly-out animation visibility |

---

### **Game Logic Flow**

#### **1. Mount Initialization (`useEffect`)**

- Load `stats` from `localStorage`.
- Calculate difficulty curve based on plays.

#### **2. startExperiment()**

- Clear any active pet state.
- Increment `plays`, save to `localStorage`.
- Reset all timers, counters, and anomalies.
- Set `gameState = 'playing'`.
- Start `timerRef` (countdown) & `anomalySpawnerRef` (spawn loop).
- Immediately spawn first anomaly.

#### **3. spawnAnomaly()**

- Creates anomaly with:
  - `id = Date.now() + Math.random()`
  - Random position, icon, color.
- Caps `anomalies.length ≤ 7` to avoid overflow.

#### **4. handleAnomalyClick(id, x, y)**

- Remove anomaly by ID.
- Add particle burst at `(x, y)`.
- Decrement `anomaliesToClick`.
- **Win Check:** If all cleared → `observe()`, else → spawn next anomaly.

#### **5. Countdown Timer**

- `timerRef` decrements `timeLeft` each second.
- **Lose Check:** If `timeLeft ≤ 1` → end game → `gameState = 'failed'`.

#### **6. observe() (Win Sequence)**

- Stop timers.
- Animate "Wave Function Collapsing…".
- After 2500ms:
  - Randomly pick `'alive' | 'ghost'`.
  - Save result to `stats` + localStorage.
  - Fly-out animation:
    - Get screen coordinates of result icon via `getBoundingClientRect()`.
    - Call `setPet(result, x, y)` with icon position.
    - Hide original icon → illusion of pet flying off card.

#### **7. reset()**

- Stops timers.
- Resets `gameState = 'idle'`.
- Pet persists across runs unless replaced by next game.

---

## 🐾 **3. Interactive Page Pet** (`src/components/page-pet.tsx`)

### **Purpose**

Client-side roaming pet rendered via **React Portal** into root layout.

### **State Variables**

| Variable        | Type                                  | Description                          |
| --------------- | ------------------------------------- | ------------------------------------ |
| `position`      | { x, y }                              | Current position                     |
| `velocity`      | { vx, vy }                            | Movement vector                      |
| `isAnimatingIn` | boolean                               | Initial fly-in animation flag        |
| `showMeow`      | boolean                               | Displays speech bubble for alive cat |
| `isVisible`     | boolean                               | Ghost visibility toggle              |
| `ghostState`    | 'stalking' \| 'hiding' \| 'swooshing' | Ghost AI states                      |

---

### **Animation Logic**

#### **1. Spawn Animation**

- On pet spawn → `animate-fly-in` with CSS vars `--start-x`, `--start-y`.
- After 1s → switch to physics loop or ghost AI.

#### **2. Cat Logic (Alive Pet)**

- **Follow Mouse:**
  - Distance > 50px → small velocity towards cursor.
  - Friction applied for natural slowdown.
  - Max speed clamped.
  - Window-edge bounce logic.
- **Interaction:**
  - `onMouseEnter` → shows "Meow" bubble for 1s.

#### **3. Ghost Logic (AI State Machine)**

- `runGhostAI()` cycles states:

| State       | Behavior                                                 |
| ----------- | -------------------------------------------------------- |
| `stalking`  | Drift slowly towards random target point, visible.       |
| `hiding`    | Fade-out for 1.5–3s → reappear randomly.                 |
| `swooshing` | High-speed dash across screen → long smooth glide (~3s). |

---

## ♾ **4. Infinite Scroller** (`src/components/infinite-scroller.tsx`)

### **Purpose**

Creates a **seamless, infinite ribbon** of scrolling elements.

### **Logic Flow (`useEffect`)**

1. On mount → run `addAnimation()`.
2. Clone each `<li>` child → append clone with `aria-hidden="true"`.
3. Doubled content enables perfect `-50%` looping via keyframes.
4. CSS vars:
   - `--animation-duration` → Speed control.
   - `--animation-direction` → Left/Right toggle.
5. Pause-on-hover via CSS hover selector.

---
