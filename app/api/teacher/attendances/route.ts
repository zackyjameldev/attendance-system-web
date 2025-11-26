import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDate, isDateInRange, isTimeInRange } from '@/lib/utils'
import { getAuthenticatedUser } from '@/lib/auth-utils'

// GET /api/teacher/attendances - Get active attendances for logged-in teacher
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = formatDate(new Date())
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    // Get all attendances for this teacher
    const attendances = await prisma.attendance.findMany({
      where: {
        teacherId: user.id,
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
      },
      orderBy: { createdAt: 'desc' },
    })

    // Filter attendances that are active today and within time range
    const activeAttendances = attendances.filter((attendance) => {
      const isToday = isDateInRange(today, attendance.dates)
      const isInTimeRange = isTimeInRange(
        currentTime,
        attendance.timeStart,
        attendance.timeEnd
      )
      return isToday && isInTimeRange
    })

    // Get all attendances grouped by field
    const fieldsMap = new Map()
    attendances.forEach((attendance) => {
      const fieldId = attendance.fieldId
      if (!fieldsMap.has(fieldId)) {
        fieldsMap.set(fieldId, {
          id: attendance.field.id,
          name: attendance.field.name,
          subjects: [],
        })
      }
      const field = fieldsMap.get(fieldId)
      const subjectExists = field.subjects.some(
        (s: any) => s.id === attendance.subject.id
      )
      if (!subjectExists) {
        field.subjects.push({
          id: attendance.subject.id,
          name: attendance.subject.name,
          year: attendance.subject.year,
          term: attendance.subject.term,
          attendances: [],
        })
      }
      const subject = field.subjects.find(
        (s: any) => s.id === attendance.subject.id
      )
      subject.attendances.push({
        id: attendance.id,
        numberOfDays: attendance.numberOfDays,
        dates: attendance.dates,
        timeStart: attendance.timeStart,
        timeEnd: attendance.timeEnd,
        isActiveToday:
          isDateInRange(today, attendance.dates) &&
          isTimeInRange(currentTime, attendance.timeStart, attendance.timeEnd),
      })
    })

    return NextResponse.json({
      activeAttendances,
      fields: Array.from(fieldsMap.values()),
    })
  } catch (error) {
    console.error('Error fetching attendances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    )
  }
}

