/**
 * @file src/lib/pet-state.ts
 * @description A simple, global state management module for the page pet.
 *              This uses a basic publish-subscribe pattern to allow any component
 *              to update or listen to changes in the pet's state, making the pet
 *              persistent across all pages of the application.
 */

// Defines the possible states for the pet.
export type PetState = 'alive' | 'ghost' | null;

// The global state object. It holds the current pet type.
let state: { pet: PetState } = {
  pet: null,
};

// A Set of all listener functions that need to be called on state change.
const listeners: Set<(state: { pet: PetState }) => void> = new Set();
// A reference to the timeout that will clear the pet.
let petTimeout: NodeJS.Timeout | null = null;

/**
 * Notifies all subscribed components that the state has changed by calling their listener functions.
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

  // If there's an old timeout running, clear it.
  if (petTimeout) {
    clearTimeout(petTimeout);
    petTimeout = null;
  }

  // If a new pet is set (i.e., not null), start a new timer to clear it.
  if (pet) {
    petTimeout = setTimeout(() => {
      setPet(null); // This will recursively call setPet to clear the state.
    }, 600000); // 10 minutes in milliseconds.
  }

  notify();
};

/**
 * Subscribes a component to state changes.
 * @param {(state: { pet: PetState }) => void} listener - The callback function to run on state change.
 * @returns {() => void} An `unsubscribe` function to be called on component unmount.
 */
export const subscribe = (listener: (state: { pet: PetState }) => void): (() => void) => {
  listeners.add(listener);
  listener(state); // Immediately invoke with current state to sync up.
  // Return the cleanup function.
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Gets a snapshot of the current state.
 * @returns {{ pet: PetState }} The current pet state.
 */
export const getSnapshot = () => {
  return state;
};
