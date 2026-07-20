"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"

type Message = {
  role: "user" | "ai"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
  }

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userQuery = input.trim()
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    setMessages((prev) => [...prev, { role: "user", content: userQuery }])
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: "ai", content: "" }])

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuery,
          session_id: "default-session",
        }),
      })

      if (!response.ok) throw new Error("Network response was not ok")
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const text = line.substring(6)
            if (text === "[DONE]") continue
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content += text
              return newMessages
            })
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content =
          "Sorry, I encountered an error. Please try again."
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--main-bg)",
        color: "var(--main-text)",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--main-border)",
          fontSize: "15px",
          fontWeight: 500,
          color: "var(--main-text)",
          flexShrink: 0,
        }}
      >
        Enterprise Knowledge Assistant
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isEmpty ? "0" : "24px 0",
        }}
      >
        {isEmpty ? (
          /* Welcome state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "16px",
              padding: "48px 24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "var(--main-text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={28} color="var(--main-bg)" />
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "var(--main-text)",
                margin: 0,
                textAlign: "center",
              }}
            >
              What can I help with?
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--main-text-muted)",
                margin: 0,
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              Ask me anything about your uploaded enterprise documents, or any general question.
            </p>
          </div>
        ) : (
          /* Conversation */
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "14px",
                  marginBottom: "24px",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: msg.role === "ai" ? "var(--main-text)" : "var(--main-border)",
                    marginTop: "2px",
                  }}
                >
                  {msg.role === "ai" ? (
                    <Bot size={16} color="var(--main-bg)" />
                  ) : (
                    <User size={16} color="var(--main-text-muted)" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: msg.role === "user" ? "10px 14px" : "0",
                    background: msg.role === "user" ? "var(--user-bubble)" : "transparent",
                    color: msg.role === "user" ? "var(--user-bubble-text)" : "var(--ai-bubble-text)",
                    borderRadius: "12px",
                    fontSize: "15px",
                    lineHeight: "1.65",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content === "" && isLoading && msg.role === "ai" ? (
                    <span style={{ color: "var(--main-text-muted)" }}>
                      <span className="thinking-dot">●</span>{" "}
                      <span className="thinking-dot" style={{ animationDelay: "0.2s" }}>●</span>{" "}
                      <span className="thinking-dot" style={{ animationDelay: "0.4s" }}>●</span>
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area — pinned to bottom */}
      <div
        style={{
          padding: "16px 24px 24px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            background: "var(--input-bg)",
            border: "1px solid var(--input-border)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
            padding: "12px 14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Enterprise AI..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "15px",
              color: "var(--main-text)",
              lineHeight: "1.6",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "none",
              cursor: input.trim() && !isLoading ? "pointer" : "default",
              background: input.trim() && !isLoading ? "var(--button-primary)" : "var(--main-border)",
              color: input.trim() && !isLoading ? "var(--button-primary-text)" : "var(--main-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--main-text-muted)",
            margin: "8px 0 0",
          }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .thinking-dot {
          display: inline-block;
          animation: blink 1.4s infinite;
          font-size: 10px;
        }
        textarea::placeholder {
          color: var(--main-text-muted);
        }
      `}</style>
    </div>
  )
}
