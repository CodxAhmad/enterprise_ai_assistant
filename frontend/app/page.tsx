"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { cn } from "../lib/utils"

type Message = {
  role: "user" | "ai"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I am your Enterprise Knowledge Assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userQuery = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userQuery }])
    setIsLoading(true)

    // Add empty AI message that we will stream into
    setMessages(prev => [...prev, { role: "ai", content: "" }])

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuery,
          session_id: "default-session"
        })
      })

      if (!response.ok) throw new Error("Network response was not ok")
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        // Basic parsing for SSE format "data: <text>\n\n"
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const text = line.substring(6)
            if (text === "[DONE]") continue
            
            setMessages(prev => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content += text
              return newMessages
            })
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = "Sorry, I encountered an error processing your request."
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-6 font-semibold">
        Chat Assistant
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex w-full gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "ai" && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
            )}
            <div className={cn(
              "relative flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 text-sm",
              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="relative mx-auto max-w-3xl flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your enterprise documents..." 
            className="flex-1 rounded-full px-4 h-12 shadow-sm pr-12"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 h-9 w-9 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
