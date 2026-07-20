"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, FileText, LayoutDashboard, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Chat", href: "/", icon: MessageSquare },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/30">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        Enterprise AI
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === link.href ? "bg-muted text-foreground" : ""
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t space-y-2">
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
