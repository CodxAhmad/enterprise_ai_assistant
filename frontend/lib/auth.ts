import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin User", email: "admin@enterprise.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
}

export default NextAuth(authOptions)
