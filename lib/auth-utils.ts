import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getAuthenticatedUser(req: NextRequest) {
  // Try session-based auth first (for web)
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return session.user
  }

  // Try token-based auth (for mobile)
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return null
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      })

      if (user && user.role === decoded.role) {
        return user
      }
    } catch (error) {
      // Invalid token
      return null
    }
  }

  return null
}

