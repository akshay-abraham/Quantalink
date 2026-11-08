import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { CommandContext, completions, runCommand } from "./commands";
import { createContent } from "../../../../test/fixtures";

const createContext = (): CommandContext => ({
  openApp: vi.fn(),
  openUrl: vi.fn(),
  closeTerminal: vi.fn(),
  clear: vi.fn(),
  history: [],
  content: createContent(),
});

const textOf = (output: React.ReactNode) =>
  render(<>{output}</>).container.textContent;

describe("terminal commands", () => {
  it("introduces the portfolio owner", () => {
    expect(runCommand("whoami", createContext())).toBe(
      "Test Person - Engineer"
    );
  });

  it("reports unknown commands like zsh", () => {
    expect(runCommand("foo bar", createContext())).toBe(
      "zsh: command not found: foo"
    );
  });

  it("ignores empty input", () => {
    expect(runCommand("   ", createContext())).toBeNull();
  });

  it("opens apps through the window manager", () => {
    const context = createContext();
    expect(runCommand("open cv", context)).toBe("Opening Portfolio.pdf...");
    expect(context.openApp).toHaveBeenCalledWith("preview");
  });

  it("opens links through the browser policy", () => {
    const context = createContext();
    expect(runCommand("open github", context)).toBe("Opening GitHub...");
    expect(context.openUrl).toHaveBeenCalledWith("https://github.com/testuser");
  });

  it("lists experience from content", () => {
    expect(textOf(runCommand("experience", createContext()))).toContain(
      "Acme - Engineer"
    );
  });

  it("only shows contact links that exist", () => {
    const text = textOf(runCommand("contact", createContext()));
    expect(text).toContain("github");
    expect(text).not.toContain("linkedin");
  });

  it("clears and exits through the context", () => {
    const context = createContext();
    runCommand("clear", context);
    runCommand("exit", context);
    expect(context.clear).toHaveBeenCalled();
    expect(context.closeTerminal).toHaveBeenCalled();
  });

  it("autocompletes commands and arguments", () => {
    expect(completions).toContain("open projects");
    expect(completions).toContain("cat about.txt");
  });
});
