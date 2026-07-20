"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Bot } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (res?.error) {
      setError("Invalid credentials. Try admin / password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--main-bg)",
        position: "fixed",
        inset: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "var(--main-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Bot size={24} color="var(--main-bg)" />
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--main-text)",
              margin: "0 0 6px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--main-text-muted)", margin: 0 }}>
            Sign in to your Enterprise AI Assistant
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              htmlFor="username"
              style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--main-text)", marginBottom: "6px" }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="admin"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--main-text)",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--main-text)", marginBottom: "6px" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--main-text)",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#dc2626", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: "4px",
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              border: "none",
              background: "var(--button-primary)",
              color: "var(--button-primary-text)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
