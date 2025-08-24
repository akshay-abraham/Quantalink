/**
 * @file src/components/theme-provider.tsx
 * @description A simplified context provider. In this version, it's a placeholder
 *              and doesn't manage themes, but it could be expanded in the future
 *              to handle theme switching (dark/light) or motion preferences.
 * @note This is a client component because it uses `createContext`.
 */
"use client"

import React, { createContext, useContext, useMemo } from 'react';

/**
 * Defines the shape of the context data.
 * Currently, it only includes a boolean for motion preferences.
 */
interface ThemeContextType {
  motionEnabled: boolean;
}

// Create the context with an initial value of undefined.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider is a wrapper component that provides the theme context to its children.
 * @param {{ children: React.ReactNode }} props - The props object.
 * @returns {JSX.Element} The provider component.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // `useMemo` is used to prevent the context value from being recalculated on every render.
  const value = useMemo(() => ({
    // Currently hardcoded to true, but could be controlled by state in the future.
    motionEnabled: true, 
  }), []);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * A custom hook to easily access the theme context.
 * It throws an error if used outside of a ThemeProvider, ensuring proper usage.
 * @returns {ThemeContextType} The theme context value.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
