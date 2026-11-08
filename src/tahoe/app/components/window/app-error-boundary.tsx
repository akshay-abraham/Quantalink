"use client";

import React from "react";

interface AppErrorBoundaryProps {
  appName: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`${this.props.appName} crashed`, error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center bg-white dark:bg-[#282025]"
      >
        <div className="text-13 font-bold">
          {this.props.appName} quit unexpectedly.
        </div>
        <div className="text-11 text-black/60 dark:text-white/60 max-w-xs">
          {this.state.error.message}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={this.props.onClose}
            className="h-7 px-4 rounded-full text-13 bg-black/5 dark:bg-white/10 active:bg-black/10"
          >
            Close
          </button>
          <button
            onClick={() => this.setState({ error: null })}
            className="h-7 px-4 rounded-full text-13 text-white bg-[#0a84ff] active:brightness-90"
          >
            Reopen
          </button>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
