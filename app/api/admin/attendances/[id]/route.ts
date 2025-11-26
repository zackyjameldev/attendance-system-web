import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateAttendanceSchema = z.object({
  numberOfDays: z.number().int().min(1),
  dates: z.array(z.string()),
  timeStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  timeEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attendanceId = params.id
    if (!attendanceId) {
      return NextResponse.json({ error: 'Attendance id is required' }, { status: 400 })
    }

    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Attendance not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = updateAttendanceSchema.parse(body)

    if (validatedData.dates.length !== validatedData.numberOfDays) {
      return NextResponse.json(
        { error: 'Number of dates must match numberOfDays' },
        { status: 400 }
      )
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        numberOfDays: validatedData.numberOfDays,
        dates: validatedData.dates,
        timeStart: validatedData.timeStart,
        timeEnd: validatedData.timeEnd,
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

    return NextResponse.json({ attendance: updatedAttendance })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating attendance:', error)
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 })
  }
}

