import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAttendanceSchema = z.object({
  fieldId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  numberOfDays: z.number().int().min(1),
  dates: z.array(z.string()),
  timeStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  timeEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  studentIds: z.array(z.string()),
})

// GET /api/admin/attendances - Get all attendances
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attendances = await prisma.attendance.findMany({
      include: {
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            year: true,
            term: true,
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

    return NextResponse.json({ attendances })
  } catch (error) {
    console.error('Error fetching attendances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    )
  }
}

// POST /api/admin/attendances - Create a new attendance
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createAttendanceSchema.parse(body)

    // Validate field exists
    const field = await prisma.field.findUnique({
      where: { id: validatedData.fieldId },
    })
    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: validatedData.subjectId },
    })
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 400 })
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

    // Validate all students exist and are students
    const students = await prisma.user.findMany({
      where: {
        id: { in: validatedData.studentIds },
        role: 'STUDENT',
        fieldId: validatedData.fieldId,
      },
    })

    if (students.length !== validatedData.studentIds.length) {
      return NextResponse.json(
        { error: 'Some students not found or invalid' },
        { status: 400 }
      )
    }

    // Validate dates array matches numberOfDays
    if (validatedData.dates.length !== validatedData.numberOfDays) {
      return NextResponse.json(
        { error: 'Number of dates must match numberOfDays' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        fieldId: validatedData.fieldId,
        subjectId: validatedData.subjectId,
        teacherId: validatedData.teacherId,
        numberOfDays: validatedData.numberOfDays,
        dates: validatedData.dates,
        timeStart: validatedData.timeStart,
        timeEnd: validatedData.timeEnd,
        studentIds: validatedData.studentIds,
      },
      include: {
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            year: true,
            term: true,
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

    return NextResponse.json({ attendance }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    )
  }
}

