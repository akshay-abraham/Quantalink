/**
 * @file src/lib/pet-state.ts
 * @description A simple, global state management module for the page pet.
 *              This uses a basic publish-subscribe pattern to allow any component
 *              to update or listen to changes in the pet's state, making the pet
 *              persistent across all pages of the application.
 */

// Defines the possible states for the pet.
export type PetType = 'alive' | 'ghost';

const PET_VISIT_KEY = 'quantalink-pet-visit';
const PET_LAST_TYPE_KEY = 'quantalink-pet-last-type';

let hasVisitedInMemory = false;
let lastPetTypeInMemory: PetType | null = null;

/**
 * Chooses the next pet. The first result favors ghosts; after that, results
 * alternate 95% of the time while retaining a small chance of repetition.
 */
export const choosePetType = (): PetType => {
  let isFirstVisit = !hasVisitedInMemory;
  let lastPetType = lastPetTypeInMemory;

  try {
    if (typeof window !== 'undefined') {
      isFirstVisit = window.localStorage.getItem(PET_VISIT_KEY) !== 'true';
      const storedLastType = window.localStorage.getItem(PET_LAST_TYPE_KEY);
      lastPetType =
        storedLastType === 'alive' || storedLastType === 'ghost'
          ? storedLastType
          : null;
    }
  } catch {
    // Continue with the in-memory fallback when storage is unavailable.
  }

  const nextType = isFirstVisit
    ? Math.random() < 0.75
      ? 'ghost'
      : 'alive'
    : lastPetType && Math.random() < 0.95
      ? lastPetType === 'ghost'
        ? 'alive'
        : 'ghost'
      : lastPetType ?? (Math.random() < 0.67 ? 'ghost' : 'alive');

  hasVisitedInMemory = true;
  lastPetTypeInMemory = nextType;

  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PET_VISIT_KEY, 'true');
      window.localStorage.setItem(PET_LAST_TYPE_KEY, nextType);
    }
  } catch {
    // Storage is optional; the in-memory state still preserves alternation.
  }

  return nextType;
};

// Defines the full state, including the type and its starting position for animation.
export interface PetState {
  type: PetType | null;
  startX: number | null;
  startY: number | null;
}

// The global state object. It holds the current pet type and start coordinates.
let state: PetState = {
  type: null,
  startX: null,
  startY: null,
};

// A Set of all listener functions that need to be called on state change.
const listeners: Set<(state: PetState) => void> = new Set();

/**
 * Notifies all subscribed components that the state has changed by calling their listener functions.
 */
const notify = () => {
  for (const listener of listeners) {
    listener(state);
  }
};

/**
 * Sets the current pet state and notifies all listeners. The pet will now
 * remain on screen until explicitly cleared by starting a new game.
 * @param {PetType | null} type - The new state for the pet ('alive', 'ghost', or null).
 * @param {number | null} startX - The starting X coordinate for the animation.
 * @param {number | null} startY - The starting Y coordinate for the animation.
 */
export const setPet = (
  type: PetType | null,
  startX: number | null = null,
  startY: number | null = null
) => {
  state = { ...state, type, startX, startY };
  notify();
};

/**
 * Subscribes a component to state changes.
 * @param {(state: PetState) => void} listener - The callback function to run on state change.
 * @returns {() => void} An `unsubscribe` function to be called on component unmount.
 */
export const subscribe = (
  listener: (state: PetState) => void
): (() => void) => {
  listeners.add(listener);
  listener(state); // Immediately invoke with current state to sync up.
  // Return the cleanup function.
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Gets a snapshot of the current state.
 * @returns {PetState} The current pet state.
 */
export const getSnapshot = () => {
  return state;
};
