import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-utils'

// GET /api/student/attendance - Get attendance results for logged-in student
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's field
    const student = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        field: {
          include: {
            subjects: {
              include: {
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                attendances: {
                  where: {
                    studentIds: {
                      has: user.id,
                    },
                  },
                  include: {
                    records: {
                      where: {
                        studentId: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!student || !student.field) {
      return NextResponse.json(
        { error: 'Student field not found' },
        { status: 404 }
      )
    }

    // Calculate attendance statistics for each subject
    const subjectsWithStats = student.field.subjects.map((subject) => {
      const attendances = subject.attendances.map((attendance) => {
        const totalDays = attendance.numberOfDays
        const presentDays = attendance.records.filter((r) => r.isPresent).length
        const absentDays = totalDays - presentDays

        return {
          id: attendance.id,
          numberOfDays: totalDays,
          dates: attendance.dates,
          timeStart: attendance.timeStart,
          timeEnd: attendance.timeEnd,
          presentDays,
          absentDays,
          attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
          records: attendance.records.map((record) => ({
            date: record.date,
            isPresent: record.isPresent,
          })),
        }
      })

      return {
        id: subject.id,
        name: subject.name,
        year: subject.year,
        term: subject.term,
        teacher: subject.teacher,
        attendances,
      }
    })

    return NextResponse.json({
      field: {
        id: student.field.id,
        name: student.field.name,
      },
      subjects: subjectsWithStats,
    })
  } catch (error) {
    console.error('Error fetching student attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

