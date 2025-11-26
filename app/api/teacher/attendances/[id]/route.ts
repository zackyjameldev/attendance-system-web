import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDate, isDateInRange, isTimeInRange } from '@/lib/utils'
import { getAuthenticatedUser } from '@/lib/auth-utils'

// GET /api/teacher/attendances/[id] - Get attendance details with students
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id },
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
      },
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
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const isActive =
      isDateInRange(today, attendance.dates) &&
      isTimeInRange(currentTime, attendance.timeStart, attendance.timeEnd)

    // Get students for this attendance
    const students = await prisma.user.findMany({
      where: {
        id: { in: attendance.studentIds },
        role: 'STUDENT',
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // Get attendance records for today
    const todayRecords = await prisma.attendanceRecord.findMany({
      where: {
        attendanceId: attendance.id,
        date: today,
      },
    })

    const studentsWithAttendance = students.map((student) => {
      const record = todayRecords.find((r) => r.studentId === student.id)
      return {
        ...student,
        isPresent: record?.isPresent || false,
        recordId: record?.id || null,
      }
    })

    return NextResponse.json({
      attendance: {
        ...attendance,
        isActive,
      },
      students: studentsWithAttendance,
    })
  } catch (error) {
    console.error('Error fetching attendance details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance details' },
      { status: 500 }
    )
  }
}

