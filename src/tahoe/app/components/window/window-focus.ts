import { createContext, useContext } from "react";

export const WindowFocusContext = createContext(true);

export const useWindowFocus = () => useContext(WindowFocusContext);
