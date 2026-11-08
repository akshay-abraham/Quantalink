import React, { useEffect, useRef, useState } from "react";

interface RenameFieldProps {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

const selectBaseName = (input: HTMLInputElement, value: string) => {
  const extension = value.lastIndexOf(".");
  input.setSelectionRange(0, extension > 0 ? extension : value.length);
};

const RenameField: React.FC<RenameFieldProps> = ({
  initialValue,
  onCommit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    selectBaseName(input, initialValue);
  }, [initialValue]);

  return (
    <input
      ref={inputRef}
      aria-label="Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={() => onCommit(value)}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") onCommit(value);
        if (e.key === "Escape") onCancel();
      }}
      className="w-full max-w-[140px] px-1 text-center rounded-[3px] bg-white dark:bg-[#1e1e1e] text-black dark:text-white outline-none ring-[3px] ring-[#0a84ff]/60"
    />
  );
};

export default RenameField;
