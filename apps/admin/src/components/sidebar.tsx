"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

/* ── Inline SVG icons ── */
const Icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  articles: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 13H8" />
      <path d="M16 17H8" />
      <path d="M16 13h-2" />
    </svg>
  ),
  categories: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  ),
  contacts: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  complementos: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 16.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 20.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 9.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
};

type IconKey = keyof typeof Icons;

const NAV: { href: string; label: string; icon: IconKey }[] = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/articles", label: "Artículos", icon: "articles" },
  { href: "/categories", label: "Categorías", icon: "categories" },
  { href: "/contacts", label: "Contactos", icon: "contacts" },
  { href: "/complementos", label: "Complementos", icon: "complementos" },
];

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const CHANGELOG_URL =
  "https://github.com/fcophox/ultra-cms/blob/main/CHANGELOG.md";

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* Restore persisted state */
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  /* Close popover on click outside */
  useEffect(() => {
    if (!popoverOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopoverOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [popoverOpen]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  /* Derive initials from email */
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";
  const displayName = userEmail ?? "Usuario";

  return (
    <aside
      className="sidebar-root"
      data-collapsed={collapsed}
      style={{ width: !mounted ? undefined : collapsed ? 64 : 240 }}
    >
      {/* ── Content ── */}
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo">
          {collapsed ? (
            <span className="sidebar-logo-icon">U</span>
          ) : (
            <>
              Ultra<span className="text-primary">CMS</span>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-icon">{Icons[item.icon]}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* ── Profile trigger + floating popover ── */}
        <div className="sidebar-profile-wrapper" ref={popoverRef}>
          {/* Popover (floats above the trigger) */}
          {popoverOpen && (
            <div className="sidebar-popover">
              <div className="sidebar-popover-header">
                <span className="sidebar-avatar">{initial}</span>
                <div className="sidebar-popover-user">
                  <span className="sidebar-popover-email">{displayName}</span>
                </div>
              </div>
              <div className="sidebar-popover-divider" />
              <ThemeToggle variant="popover" />
              <div className="sidebar-popover-divider" />
              <form action="/auth/signout" method="post">
                <button className="sidebar-popover-item" type="submit">
                  <span className="sidebar-icon">{Icons.logout}</span>
                  Cerrar sesión
                </button>
              </form>
              <a
                href={CHANGELOG_URL}
                target="_blank"
                rel="noreferrer"
                className="sidebar-popover-item"
              >
                <span className="sidebar-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
                UltraCMS v{VERSION} · Novedades
              </a>
            </div>
          )}

          {/* Trigger button */}
          <button
            type="button"
            className="sidebar-profile-trigger"
            onClick={() => setPopoverOpen((v) => !v)}
            title={collapsed ? displayName : undefined}
          >
            <span className="sidebar-avatar">{initial}</span>
            {!collapsed && (
              <span className="sidebar-profile-name">{displayName}</span>
            )}
            {!collapsed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sidebar-profile-chevron"
                data-open={popoverOpen}
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Collapse toggle on right border ── */}
      <div className="sidebar-edge" onClick={toggle}>
        <button
          type="button"
          className="sidebar-toggle-btn"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sidebar-chevron"
            data-collapsed={collapsed}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

