import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDate, isDateInRange, isTimeInRange } from '@/lib/utils'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { z } from 'zod'

// const markAttendanceSchema = z.object({
//   studentId: z.string(),
//   isPresent: z.boolean(),
//   date: z.string().optional(),
// })

const markAttendanceSchema = z.object({
  studentId: z.string(),
  isPresent: z.boolean(),
  date: z.string().nullable().optional(), // Allow both null and undefined
})

// POST /api/teacher/attendances/[id]/mark - Mark student attendance
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = markAttendanceSchema.parse(body)

    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id },
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      )
    }

    if (attendance.teacherId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const today = formatDate(new Date())
    const dateToUse = validatedData.date || today

    // Validate date is in attendance dates
    if (!isDateInRange(dateToUse, attendance.dates)) {
      return NextResponse.json(
        { error: 'Date is not valid for this attendance' },
        { status: 400 }
      )
    }

    // Validate student is in attendance studentIds
    if (!attendance.studentIds.includes(validatedData.studentId)) {
      return NextResponse.json(
        { error: 'Student is not part of this attendance' },
        { status: 400 }
      )
    }

    // Upsert attendance record
    const record = await prisma.attendanceRecord.upsert({
      where: {
        attendanceId_studentId_date: {
          attendanceId: attendance.id,
          studentId: validatedData.studentId,
          date: dateToUse,
        },
      },
      update: {
        isPresent: validatedData.isPresent,
      },
      create: {
        attendanceId: attendance.id,
        studentId: validatedData.studentId,
        date: dateToUse,
        isPresent: validatedData.isPresent,
      },
    })

    return NextResponse.json({ record })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error marking attendance:', error)
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  }
}

