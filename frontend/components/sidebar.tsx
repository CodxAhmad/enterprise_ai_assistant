"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, FileText, LayoutDashboard, LogOut, Bot } from "lucide-react"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "New chat", href: "/", icon: MessageSquare },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Analytics", href: "/dashboard", icon: LayoutDashboard },
  ]

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        flexShrink: 0,
      }}
    >
      {/* Logo / App name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 14px 12px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--sidebar-text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={18} color="var(--sidebar-bg)" />
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: "15px",
            color: "var(--sidebar-text)",
          }}
        >
          Enterprise AI
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 400,
                color: isActive ? "var(--sidebar-text)" : "var(--sidebar-text-muted)",
                background: isActive ? "var(--sidebar-active)" : "transparent",
                marginBottom: "2px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--sidebar-hover)"
                  e.currentTarget.style.color = "var(--sidebar-text)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "var(--sidebar-text-muted)"
                }
              }}
            >
              <Icon size={16} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: "var(--sidebar-text-muted)",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--sidebar-hover)"
            e.currentTarget.style.color = "var(--sidebar-text)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "var(--sidebar-text-muted)"
          }}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
