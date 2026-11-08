import React from "react";
import { cn } from "../lib/utils";

interface SymbolProps {
  name: string;
  className?: string;
}

const Symbol: React.FC<SymbolProps> = ({ name, className }) => (
  <span
    aria-hidden
    className={cn("inline-block shrink-0 bg-current w-4 h-4", className)}
    style={{
      maskImage: `url(/symbols/${name}.png)`,
      WebkitMaskImage: `url(/symbols/${name}.png)`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

export default Symbol;
