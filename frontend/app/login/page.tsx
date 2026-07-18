"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Bot } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid credentials. Try admin / password")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 fixed inset-0 z-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-2">
            <Bot className="h-6 w-6 text-gray-900" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access the Enterprise Assistant
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="username">
                Username
              </label>
              <Input 
                id="username" 
                placeholder="admin" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
