import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFieldSchema = z.object({
  name: z.string().min(1),
})

// GET /api/admin/fields - Get all fields
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fields = await prisma.field.findMany({
      include: {
        _count: {
          select: {
            users: true,
            subjects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ fields })
  } catch (error) {
    console.error('Error fetching fields:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    )
  }
}

// POST /api/admin/fields - Create a new field
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createFieldSchema.parse(body)

    const field = await prisma.field.create({
      data: {
        name: validatedData.name,
      },
    })

    return NextResponse.json({ field }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating field:', error)
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    )
  }
}

