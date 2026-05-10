// Ambient declaration file — augments Express namespace globally.
// TypeScript merges this with @types/express automatically.

declare namespace Express {
  interface Response {
    sendSuccess(data: unknown, message?: string, statusCode?: number): Response
    sendError(message?: string, statusCode?: number, error?: unknown): Response
  }
  interface Request {
    user?: {
      userId: string
      email: string
      role: string
    }
  }
}
