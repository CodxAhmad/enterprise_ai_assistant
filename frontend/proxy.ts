import { withAuth } from "next-auth/middleware"

export default withAuth(
  function proxy(req) {
    // Custom proxy logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/", "/documents", "/dashboard"],
}
