"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
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
        }}
      >
        <Moon size={16} />
        <span>Dark Mode</span>
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  )
}
