"use client";

import { useEffect, useState, useRef } from "react";
import { apps, App, AppId } from "../../lib/apps";
import { useWindows } from "../../context/window-context";
import AppIcon from "../dock/app-icon";
import Symbol from "../symbol";
import { readStorage, writeStorage } from "../../lib/storage";
import { useFullscreen } from "../../hooks/use-fullscreen";
import {
  defaultMobileOrder,
  normalizeMobileOrder,
  moveMobileIcon,
} from "./icon-order";

function HomeIcon({
  app,
  dock = false,
  editing,
  onEdit,
  onMove,
}: {
  app: App;
  dock?: boolean;
  editing: boolean;
  onEdit: () => void;
  onMove: (from: AppId, to: AppId) => void;
}) {
  const { openApp } = useWindows();
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragFrame = useRef<DOMRect | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);
  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    []
  );
  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };
  const finish = (
    event: React.PointerEvent<HTMLButtonElement>,
    cancelled = false
  ) => {
    clearHold();
    press.current = null;
    if (!start.current) return;
    if (!cancelled) {
      const target = document
        .elementsFromPoint(event.clientX, event.clientY)
        .map((el) => el.closest<HTMLElement>("[data-app-slot]"))
        .find((el) => el && el.dataset.appSlot !== app.id);
      if (target) onMove(app.id, target.dataset.appSlot as AppId);
    }
    start.current = null;
    dragFrame.current = null;
    suppressClick.current = true;
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  };
  return (
    <div data-app-slot={app.id} className="ios-icon-slot">
      <button
        className="ios-app-icon"
        data-dragging={dragging}
        style={{
          touchAction: "none",
          ...(dragging && dragFrame.current
            ? {
                position: "fixed",
                left: dragFrame.current.left,
                top: dragFrame.current.top,
                width: dragFrame.current.width,
              }
            : {}),
          transform: dragging
            ? `translate(${offset.x}px, ${offset.y}px) scale(1.12)`
            : undefined,
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          if (!editing) openApp(app.id);
        }}
        aria-label={editing ? `Move ${app.name}` : `Open ${app.name}`}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          suppressClick.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
          const point = { x: event.clientX, y: event.clientY };
          press.current = point;
          if (editing) {
            dragFrame.current = event.currentTarget.getBoundingClientRect();
            start.current = point;
            setDragging(true);
          } else if (event.pointerType !== "mouse") {
            const frame = event.currentTarget.getBoundingClientRect();
            holdTimer.current = setTimeout(() => {
              dragFrame.current = frame;
              start.current = point;
              suppressClick.current = true;
              setDragging(true);
              onEdit();
            }, 450);
          }
        }}
        onPointerMove={(event) => {
          if (
            press.current &&
            !start.current &&
            Math.hypot(
              event.clientX - press.current.x,
              event.clientY - press.current.y
            ) > 10
          )
            clearHold();
          if (start.current)
            setOffset({
              x: event.clientX - start.current.x,
              y: event.clientY - start.current.y,
            });
        }}
        onPointerUp={(event) => finish(event)}
        onPointerCancel={(event) => finish(event, true)}
        onKeyDown={(event) => {
          if (!editing || !["ArrowLeft", "ArrowRight"].includes(event.key))
            return;
          event.preventDefault();
          const slots = Array.from(
            document.querySelectorAll<HTMLElement>("[data-app-slot]")
          );
          const index = slots.findIndex((el) => el.dataset.appSlot === app.id);
          const target = slots[index + (event.key === "ArrowRight" ? 1 : -1)];
          if (target) onMove(app.id, target.dataset.appSlot as AppId);
        }}
      >
        <span className="ios-icon-image">
          <AppIcon icon={app.icon} />
        </span>
        {!dock && <span className="ios-icon-label">{app.name}</span>}
      </button>
    </div>
  );
}

export default function MobileHome() {
  const { focusedId, focusDesktop, closeApp } = useWindows();
  const [order, setOrder] = useState(defaultMobileOrder);
  const [editing, setEditing] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [fullscreenHelp, setFullscreenHelp] = useState(false);
  const { isFullscreen } = useFullscreen();
  const contentRef = useRef<HTMLDivElement>(null);
  const homeHold = useRef<ReturnType<typeof setTimeout> | null>(null);
  const homePress = useRef<{ x: number; y: number } | null>(null);
  const statusPress = useRef<{ x: number; y: number } | null>(null);
  useEffect(
    () => () => {
      if (homeHold.current) clearTimeout(homeHold.current);
    },
    []
  );
  const clearHomeHold = () => {
    if (homeHold.current) clearTimeout(homeHold.current);
    homeHold.current = null;
    homePress.current = null;
  };
  useEffect(
    () =>
      setOrder(
        normalizeMobileOrder(
          readStorage("mobile:icon-order", defaultMobileOrder)
        )
      ),
    []
  );
  const moveIcon = (from: AppId, to: AppId) =>
    setOrder((current) => {
      const next = moveMobileIcon(current, from, to);
      writeStorage("mobile:icon-order", next);
      return next;
    });
  const enterFullscreen = async () => {
    setControlsOpen(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (
      document.fullscreenEnabled &&
      document.documentElement.requestFullscreen
    ) {
      try {
        await document.documentElement.requestFullscreen();
        return;
      } catch {}
    }
    setFullscreenHelp(true);
  };
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  const time =
    now?.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    }) ?? "—:—";
  const date =
    now?.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) ?? "";

  return (
    <div className="ios-shell" data-app-open={!!focusedId}>
      <header
        className="ios-status-bar"
        aria-label="Status bar"
        onPointerDownCapture={(event) => {
          statusPress.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUpCapture={(event) => {
          if (
            statusPress.current &&
            event.clientY - statusPress.current.y > 50 &&
            Math.abs(event.clientX - statusPress.current.x) < 100
          )
            setControlsOpen(true);
          statusPress.current = null;
        }}
        onPointerCancelCapture={() => {
          statusPress.current = null;
        }}
      >
        <button
          aria-label="Scroll to top"
          onClick={() => {
            const root = focusedId
              ? document.querySelector<HTMLElement>(".mobile-app:not([hidden])")
              : contentRef.current;
            root?.querySelectorAll<HTMLElement>("*").forEach((element) => {
              if (element.scrollTop > 0)
                element.scrollTo({ top: 0, behavior: "smooth" });
            });
            if (!focusedId)
              contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <time>{time}</time>
        </button>
        {!focusedId && (
          <button
            className="ios-control-trigger"
            aria-label="Open controls"
            aria-expanded={controlsOpen}
            onClick={() => setControlsOpen(true)}
          >
            <Symbol name="wifi" className="w-4 h-4" />
          </button>
        )}
        {focusedId && (
          <button
            className="ios-close-app"
            onClick={() => closeApp(focusedId)}
            aria-label={`Close ${apps.find((app) => app.id === focusedId)?.name ?? "app"}`}
          >
            Close
          </button>
        )}
      </header>
      <section
        className="ios-home"
        aria-label="Home screen"
        hidden={!!focusedId}
        onPointerDown={(event) => {
          if (
            editing ||
            event.pointerType === "mouse" ||
            (event.target as HTMLElement).closest("button, a, input")
          )
            return;
          homePress.current = { x: event.clientX, y: event.clientY };
          homeHold.current = setTimeout(() => {
            setEditMenuOpen(true);
            clearHomeHold();
          }, 500);
        }}
        onPointerMove={(event) => {
          if (
            homePress.current &&
            Math.hypot(
              event.clientX - homePress.current.x,
              event.clientY - homePress.current.y
            ) > 10
          )
            clearHomeHold();
        }}
        onPointerUp={clearHomeHold}
        onPointerCancel={clearHomeHold}
        onContextMenu={(event) => {
          if ((event.target as HTMLElement).closest("button, a, input")) return;
          event.preventDefault();
          setEditMenuOpen(true);
        }}
      >
        {editMenuOpen && (
          <div className="ios-edit-menu">
            <button
              onClick={() => {
                setEditing(true);
                setEditMenuOpen(false);
              }}
            >
              Edit Home Screen
            </button>
            <button onClick={() => setEditMenuOpen(false)}>Cancel</button>
          </div>
        )}
        <div ref={contentRef} className="ios-home-content">
          {editing && (
            <div className="ios-home-actions">
              <button onClick={() => setEditing(false)}>Done</button>
            </div>
          )}
          {editing && (
            <p className="ios-edit-hint">
              Drag icons to rearrange them, including the dock.
            </p>
          )}
          <section className="ios-clock-widget" aria-label="Clock widget">
            <span className="ios-clock-date">{date}</span>
            <time className="ios-clock-time" dateTime={now?.toISOString()}>
              {time}
            </time>
            <span className="ios-clock-caption">Local time</span>
          </section>
          <div className="ios-app-grid">
            {order.slice(0, -4).map((id) => (
              <HomeIcon
                key={id}
                app={apps.find((app) => app.id === id)!}
                editing={editing}
                onEdit={() => setEditing(true)}
                onMove={moveIcon}
              />
            ))}
          </div>
        </div>
        <nav className="ios-dock" aria-label="App dock">
          {order.slice(-4).map((id) => (
            <HomeIcon
              key={id}
              app={apps.find((app) => app.id === id)!}
              dock
              editing={editing}
              onEdit={() => setEditing(true)}
              onMove={moveIcon}
            />
          ))}
        </nav>
      </section>
      {controlsOpen && (
        <div className="ios-controls">
          <button
            className="ios-controls-backdrop"
            aria-label="Dismiss controls"
            onClick={() => setControlsOpen(false)}
          />
          <section className="ios-controls-panel" aria-label="Controls">
            <div className="ios-controls-heading">
              <strong>Controls</strong>
              <button onClick={() => setControlsOpen(false)}>Done</button>
            </div>
            <button className="ios-fullscreen-toggle" onClick={enterFullscreen}>
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </button>
          </section>
        </div>
      )}
      {fullscreenHelp && (
        <div className="ios-fullscreen-help" role="status">
          <strong>Open without browser controls</strong>
          <p>
            On iPhone, tap Safari&apos;s Share button, then Add to Home Screen.
            Open the new icon to use the full screen.
          </p>
          <button onClick={() => setFullscreenHelp(false)}>Got it</button>
        </div>
      )}
      <button
        className="ios-home-button"
        onClick={focusDesktop}
        aria-label="Return to Home screen"
      >
        <span />
      </button>
    </div>
  );
}
