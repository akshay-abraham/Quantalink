import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MenuDropdown from "./menu-dropdown";

afterEach(() => {
  vi.useRealTimers();
});

describe("MenuDropdown", () => {
  it("runs fullscreen actions inside the click gesture", () => {
    vi.useFakeTimers();
    const enterFullscreen = vi.fn();
    const onClose = vi.fn();

    render(
      <MenuDropdown
        entries={[
          {
            label: "Enter Full Screen",
            requiresUserActivation: true,
            onClick: enterFullscreen,
          },
        ]}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Enter Full Screen" })
    );

    expect(enterFullscreen).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.runAllTimers());

    expect(onClose).toHaveBeenCalledOnce();
  });
});
