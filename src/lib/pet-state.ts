/**
 * @file src/lib/pet-state.ts
 * @description A simple, global state management module for the page pet.
 *              This uses a basic publish-subscribe pattern to allow any component
 *              to update or listen to changes in the pet's state.
 */

export type PetState = 'alive' | 'ghost' | null;

// The global state object.
let state: { pet: PetState } = {
  pet: null,
};

// A list of all listener functions.
const listeners: Set<(state: { pet: PetState }) => void> = new Set();
let petTimeout: NodeJS.Timeout | null = null;

/**
 * Notifies all subscribed components that the state has changed.
 */
const notify = () => {
  for (const listener of listeners) {
    listener(state);
  }
};

/**
 * Sets the current pet state and notifies all listeners.
 * Also manages the timeout to clear the pet after a duration.
 * @param {PetState} pet - The new state for the pet ('alive', 'ghost', or null).
 */
export const setPet = (pet: PetState) => {
  state = { ...state, pet };

  // If there's an old timeout, clear it.
  if (petTimeout) {
    clearTimeout(petTimeout);
    petTimeout = null;
  }

  // If a new pet is set (not null), start a timer to clear it.
  if (pet) {
    petTimeout = setTimeout(() => {
      setPet(null); // Clear the pet after 10 minutes.
    }, 600000); // 10 minutes in milliseconds
  }

  notify();
};

/**
 * Subscribes a component to state changes.
 * @param {(state: { pet: PetState }) => void} listener - The callback function to run on state change.
 * @returns {() => void} An unsubscribe function.
 */
export const subscribe = (listener: (state: { pet: PetState }) => void): (() => void) => {
  listeners.add(listener);
  listener(state); // Immediately invoke with current state
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Gets the current state.
 * @returns {{ pet: PetState }} The current pet state.
 */
export const getSnapshot = () => {
  return state;
};
