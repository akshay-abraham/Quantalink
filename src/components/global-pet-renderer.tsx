/**
 * @file src/components/global-pet-renderer.tsx
 * @description A client component that subscribes to the global pet state
 *              and renders the PagePet component if a pet is active.
 *              This component lives in the root layout to persist across all pages.
 */
'use client';

import { useEffect, useState } from 'react';
import { subscribe, getSnapshot, PetState } from '@/lib/pet-state';
import PagePet from './page-pet';

export default function GlobalPetRenderer() {
  const [petState, setPetState] = useState<PetState>(getSnapshot().pet);

  useEffect(() => {
    // Subscribe to the global state and get an unsubscribe function back.
    const unsubscribe = subscribe((newState) => {
      setPetState(newState.pet);
    });

    // Cleanup subscription on component unmount.
    return () => unsubscribe();
  }, []);

  // If there's no active pet, render nothing.
  if (!petState) {
    return null;
  }

  // If there is an active pet, render the PagePet component.
  return <PagePet type={petState} />;
}
