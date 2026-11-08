import { forwardRef, useEffect, useRef, useState } from "react";
import Symbol from "../../symbol";
import { getHost, isSecure } from "../../../lib/browser";
import { cn } from "../../../lib/utils";

interface AddressBarProps {
  url: string;
  isLoading: boolean;
  onSubmit: (input: string) => void;
  onReload: () => void;
  onStop: () => void;
}

const AddressBar = forwardRef<HTMLInputElement, AddressBarProps>(
  ({ url, isLoading, onSubmit, onReload, onStop }, ref) => {
    const [value, setValue] = useState(url);
    const [isEditing, setIsEditing] = useState(false);
    const selectOnMouseUp = useRef(false);

    useEffect(() => {
      if (!isEditing) setValue(url);
    }, [url, isEditing]);

    return (
      <form
        role="search"
        className={cn(
          "relative flex items-center w-full max-w-[480px] h-9 rounded-full px-3 gap-2 bg-black/[0.05] dark:bg-white/[0.08] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.08)]",
          isEditing && "ring-[3px] ring-[#0a84ff]/60"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
          (document.activeElement as HTMLElement | null)?.blur();
        }}
      >
        {isEditing || !url ? (
          <Symbol
            name="magnifyingglass"
            className="w-3.5 h-3.5 shrink-0 opacity-50"
          />
        ) : (
          isSecure(url) && (
            <Symbol name="lock-fill" className="w-3 h-3 shrink-0 opacity-50" />
          )
        )}
        <input
          ref={ref}
          aria-label="Address"
          value={isEditing ? value : url ? getHost(url) : ""}
          placeholder="Search or enter website name"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onMouseDown={() => {
            selectOnMouseUp.current = !isEditing;
          }}
          onMouseUp={(e) => {
            if (!selectOnMouseUp.current) return;
            selectOnMouseUp.current = false;
            e.preventDefault();
            e.currentTarget.select();
          }}
          onFocus={(e) => {
            setIsEditing(true);
            setValue(url);
            const input = e.currentTarget;
            requestAnimationFrame(() => input.select());
          }}
          onBlur={() => setIsEditing(false)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            setValue(url);
            e.currentTarget.blur();
          }}
          className={cn(
            "flex-grow min-w-0 bg-transparent outline-none text-14 placeholder:text-black/45 dark:placeholder:text-white/45",
            !isEditing && url && "text-center"
          )}
        />
        {url && !isEditing && (
          <button
            type="button"
            aria-label={isLoading ? "Stop loading" : "Reload page"}
            onClick={isLoading ? onStop : onReload}
            className="opacity-60 active:opacity-100"
          >
            <Symbol
              name={isLoading ? "xmark" : "arrow-clockwise"}
              className="w-3 h-3"
            />
          </button>
        )}
      </form>
    );
  }
);

AddressBar.displayName = "AddressBar";

export default AddressBar;
