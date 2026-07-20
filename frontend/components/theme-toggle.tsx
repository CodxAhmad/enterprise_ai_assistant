"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-full" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-sm font-medium"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Dark Mode
        </>
      )}
    </button>
  )
}
