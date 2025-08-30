/**
 * @file src/components/global-pet-renderer.tsx
 * @description A client component that subscribes to the global pet state
 *              and renders the PagePet component if a pet is active.
 *              This component lives in the root layout to persist across all pages,
 *              ensuring the pet follows the user throughout their session.
 */
'use client';

import { useEffect, useState } from 'react';
import { subscribe, getSnapshot, PetState } from '@/lib/pet-state';
import PagePet from './page-pet';

/**
 * GlobalPetRenderer is a crucial component for making the page pet persistent.
 * It listens for changes in the global state and renders the pet when active.
 * @returns {JSX.Element | null} The PagePet component if a pet is active, otherwise null.
 */
export default function GlobalPetRenderer() {
  // Use state to hold the current pet state, initialized from the global snapshot.
  const [petState, setPetState] = useState<PetState>(getSnapshot());

  useEffect(() => {
    // Subscribe to the global state on component mount. The `subscribe` function
    // returns an `unsubscribe` function for cleanup.
    const unsubscribe = subscribe((newState) => {
      setPetState(newState);
    });

    // Cleanup the subscription when the component unmounts to prevent memory leaks.
    return () => unsubscribe();
  }, []);

  // If there's no active pet in the global state, render nothing.
  if (!petState.type) {
    return null;
  }

  // If a pet is active, render the PagePet component with the correct type and start coordinates.
  return <PagePet type={petState.type} startX={petState.startX} startY={petState.startY} />;
}
