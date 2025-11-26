import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSubjectSchema = z.object({
  name: z.string().min(1),
  fieldId: z.string(),
  teacherId: z.string(),
  year: z.number().int().min(1).max(10),
  term: z.number().int().min(1).max(4),
})

// GET /api/admin/subjects - Get all subjects
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      include: {
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/admin/subjects - Create a new subject
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createSubjectSchema.parse(body)

    // Validate field exists
    const field = await prisma.field.findUnique({
      where: { id: validatedData.fieldId },
    })
    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 400 })
    }

    // Validate teacher exists and is a teacher
    const teacher = await prisma.user.findUnique({
      where: { id: validatedData.teacherId },
    })
    if (!teacher || teacher.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Teacher not found or invalid role' },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name: validatedData.name,
        fieldId: validatedData.fieldId,
        teacherId: validatedData.teacherId,
        year: validatedData.year,
        term: validatedData.term,
      },
      include: {
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ subject }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}

