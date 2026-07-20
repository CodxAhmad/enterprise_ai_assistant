"use client"

import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { MessageSquare, FileText, LayoutDashboard, LogOut, Bot, Plus } from "lucide-react"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"

export function SidebarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentSessionId = searchParams.get("session")

  const [sessions, setSessions] = useState<any[]>([])

  const links = [
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Analytics", href: "/dashboard", icon: LayoutDashboard },
  ]

  const fetchSessions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const res = await fetch(`${apiUrl}/chat/sessions`)
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch (e) {
      console.error("Error fetching sessions:", e)
    }
  }

  useEffect(() => {
    fetchSessions()
    
    // Refresh sessions when a chat is updated
    window.addEventListener("chat-updated", fetchSessions)
    return () => {
      window.removeEventListener("chat-updated", fetchSessions)
    }
  }, [])

  const startNewChat = () => {
    // Generate a quick random ID for the session
    const randomId = Math.random().toString(36).substring(2, 15)
    router.push(`/?session=${randomId}`)
  }

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

      {/* Action / New Chat button */}
      <div style={{ padding: "8px 8px 4px" }}>
        <button
          onClick={startNewChat}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "transparent",
            border: "1px solid var(--sidebar-border)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--sidebar-text)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--sidebar-hover)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={16} />
            New chat
          </span>
          <Plus size={16} />
        </button>
      </div>

      {/* Pages Section */}
      <div style={{ padding: "4px 8px" }}>
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
      </div>

      <div
        style={{
          padding: "8px 12px 4px",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--sidebar-text-muted)",
          textTransform: "uppercase",
          borderTop: "1px solid var(--sidebar-border)",
          marginTop: "8px",
        }}
      >
        Recent Chats
      </div>

      {/* Chat Sessions list */}
      <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        {sessions.length === 0 ? (
          <div
            style={{
              padding: "12px 10px",
              fontSize: "13px",
              color: "var(--sidebar-text-muted)",
              fontStyle: "italic",
            }}
          >
            No recent chats
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = pathname === "/" && currentSessionId === s.session_id
            return (
              <Link
                key={s.session_id}
                href={`/?session=${s.session_id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13px",
                  color: isActive ? "var(--sidebar-text)" : "var(--sidebar-text-muted)",
                  background: isActive ? "var(--sidebar-active)" : "transparent",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
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
                {s.title}
              </Link>
            )
          })
        )}
      </div>

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

import { Suspense } from "react"

export function Sidebar() {
  return (
    <Suspense fallback={<div style={{ width: "260px" }} />}>
      <SidebarContent />
    </Suspense>
  )
}
