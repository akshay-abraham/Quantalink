/**
 * @file src/components/game-prompt-dialog.tsx
 * @description A dialog that appears once for first-time visitors, prompting them to try the game.
 *              It uses localStorage to track whether the user has seen it before.
 * @note This is a client component because it uses state and interacts with localStorage.
 */
"use client";

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Box, Gamepad2 } from 'lucide-react';

const STORAGE_KEY = 'hasSeenGamePrompt';

/**
 * GamePromptDialog component shows a one-time welcome message about the game.
 * @returns {JSX.Element | null} The rendered dialog or null.
 */
export default function GamePromptDialog() {
  const [isOpen, setIsOpen] = useState(false);

  // This effect runs only on the client after mounting.
  useEffect(() => {
    // Check if the prompt has been seen before.
    const hasSeenPrompt = localStorage.getItem(STORAGE_KEY);
    
    // If it's the user's first visit, open the dialog after a short delay.
    if (!hasSeenPrompt) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Wait 1.5 seconds before showing the prompt.

      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Handles closing the dialog and setting the flag in localStorage.
   */
  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Gamepad2 className="w-8 h-8" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl text-primary">
            Welcome to the Experiment!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-foreground/80 pt-2">
            This portfolio isn't just for reading. Scroll down to find the
            <span className="font-bold text-primary/90"> "Quantum Conundrum"</span>, an interactive game. Your observation will determine the outcome. Give it a try!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction asChild>
            <Button onClick={handleClose} className="w-full">Let's Play!</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
