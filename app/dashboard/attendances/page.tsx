'use client'

import { useEffect, useState } from 'react'

type AttendanceFormData = {
  fieldId: string
  subjectId: string
  teacherId: string
  numberOfDays: number
  dates: string[]
  timeStart: string
  timeEnd: string
  studentIds: string[]
}

type EditAttendanceFormData = {
  id: string
  numberOfDays: number
  dates: string[]
  timeStart: string
  timeEnd: string
  fieldName: string
  subjectName: string
  teacherName: string
}

const DEFAULT_NUMBER_OF_DAYS = 10

const syncDatesArray = (dates: string[], length: number) => {
  const next = dates.slice(0, length)
  while (next.length < length) {
    next.push('')
  }
  return next
}

const buildSequentialDates = (length: number, seedDate?: string) => {
  let anchor = seedDate ? new Date(seedDate) : new Date()
  if (Number.isNaN(anchor.getTime())) {
    anchor = new Date()
  }

  const dates: string[] = []
  for (let i = 0; i < length; i++) {
    const date = new Date(anchor)
    date.setDate(anchor.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<any[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState<EditAttendanceFormData | null>(null)
  const [formData, setFormData] = useState<AttendanceFormData>({
    fieldId: '',
    subjectId: '',
    teacherId: '',
    numberOfDays: DEFAULT_NUMBER_OF_DAYS,
    dates: syncDatesArray([], DEFAULT_NUMBER_OF_DAYS),
    timeStart: '09:00',
    timeEnd: '12:00',
    studentIds: [],
  })

  useEffect(() => {
    fetchAttendances()
    fetchFields()
    fetchTeachers()
  }, [])

  useEffect(() => {
    if (formData.fieldId) {
      fetchSubjects()
      fetchStudents()
    }
  }, [formData.fieldId])

  const fetchAttendances = async () => {
    try {
      const res = await fetch('/api/admin/attendances')
      const data = await res.json()
      setAttendances(data.attendances || [])
    } catch (error) {
      console.error('Error fetching attendances:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/admin/fields')
      const data = await res.json()
      setFields(data.fields || [])
    } catch (error) {
      console.error('Error fetching fields:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects')
      const data = await res.json()
      const filtered = (data.subjects || []).filter(
        (s: any) => s.fieldId === formData.fieldId
      )
      setSubjects(filtered)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setTeachers((data.users || []).filter((u: any) => u.role === 'TEACHER'))
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/admin/students?fieldId=${formData.fieldId}`)
      const data = await res.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleNumberOfDaysChange = (value: string) => {
    const parsed = Math.max(1, Number(value) || 1)
    setFormData((prev) => ({
      ...prev,
      numberOfDays: parsed,
      dates: syncDatesArray(prev.dates, parsed),
    }))
  }

  const handleDateInputChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedDates = [...prev.dates]
      updatedDates[index] = value
      return { ...prev, dates: updatedDates }
    })
  }

  const autoFillDates = () => {
    setFormData((prev) => ({
      ...prev,
      dates: buildSequentialDates(prev.numberOfDays, prev.dates.find((d) => d) || undefined),
    }))
  }

  const openEditModal = (attendance: any) => {
    setEditForm({
      id: attendance.id,
      numberOfDays: attendance.numberOfDays,
      dates: syncDatesArray(attendance.dates || [], attendance.numberOfDays),
      timeStart: attendance.timeStart,
      timeEnd: attendance.timeEnd,
      fieldName: attendance.field?.name || 'Unknown field',
      subjectName: attendance.subject?.name || 'Unknown subject',
      teacherName: attendance.teacher?.name || 'Unknown teacher',
    })
    setShowEditModal(true)
  }

  const handleEditNumberOfDaysChange = (value: string) => {
    if (!editForm) return
    const parsed = Math.max(1, Number(value) || 1)
    setEditForm({
      ...editForm,
      numberOfDays: parsed,
      dates: syncDatesArray(editForm.dates, parsed),
    })
  }

  const handleEditDateChange = (index: number, value: string) => {
    if (!editForm) return
    const updatedDates = [...editForm.dates]
    updatedDates[index] = value
    setEditForm({ ...editForm, dates: updatedDates })
  }

  const autoFillEditDates = () => {
    if (!editForm) return
    setEditForm({
      ...editForm,
      dates: buildSequentialDates(
        editForm.numberOfDays,
        editForm.dates.find((d) => d) || undefined
      ),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.dates.length !== formData.numberOfDays || formData.dates.some((date) => !date)) {
      alert('Please provide dates for each day')
      return
    }
    if (formData.studentIds.length === 0) {
      alert('Please select at least one student')
      return
    }
    try {
      const res = await fetch('/api/admin/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setFormData({
          fieldId: '',
          subjectId: '',
          teacherId: '',
          numberOfDays: DEFAULT_NUMBER_OF_DAYS,
          dates: syncDatesArray([], DEFAULT_NUMBER_OF_DAYS),
          timeStart: '09:00',
          timeEnd: '12:00',
          studentIds: [],
        })
        fetchAttendances()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create attendance')
      }
    } catch (error) {
      console.error('Error creating attendance:', error)
      alert('Failed to create attendance')
    }
  }

  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm) return
    if (editForm.dates.length !== editForm.numberOfDays || editForm.dates.some((date) => !date)) {
      alert('Please provide dates for each day')
      return
    }

    try {
      const res = await fetch(`/api/admin/attendances/${editForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numberOfDays: editForm.numberOfDays,
          dates: editForm.dates,
          timeStart: editForm.timeStart,
          timeEnd: editForm.timeEnd,
        }),
      })

      if (res.ok) {
        setShowEditModal(false)
        setEditForm(null)
        fetchAttendances()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update attendance')
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Failed to update attendance')
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditForm(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendances</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Attendance
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-bold mb-4">Create Attendance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field
                </label>
                <select
                  value={formData.fieldId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fieldId: e.target.value,
                      subjectId: '',
                      studentIds: [],
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Field</option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  required
                  disabled={!formData.fieldId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfDays}
                  onChange={(e) => handleNumberOfDaysChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Attendance Dates</label>
                  <button
                    type="button"
                    onClick={autoFillDates}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Auto-fill sequential
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {Array.from({ length: formData.numberOfDays }).map((_, index) => (
                    <input
                      key={index}
                      type="date"
                      required
                      value={formData.dates[index] || ''}
                      onChange={(e) => handleDateInputChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Students
                </label>
                <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
                  {students.map((student) => (
                    <label key={student.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={formData.studentIds.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              studentIds: [...formData.studentIds, student.id],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              studentIds: formData.studentIds.filter((id) => id !== student.id),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{student.name} ({student.email})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Time Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={attendance.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {attendance.field?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attendance.subject?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attendance.teacher?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attendance.numberOfDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attendance.timeStart} - {attendance.timeEnd}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => openEditModal(attendance)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit dates
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full my-8">
            <h2 className="text-2xl font-bold mb-1">Edit Attendance Dates</h2>
            <p className="text-sm text-gray-600 mb-4">
              {editForm.fieldName} • {editForm.subjectName} • {editForm.teacherName}
            </p>
            <form onSubmit={handleUpdateAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  value={editForm.numberOfDays}
                  onChange={(e) => handleEditNumberOfDaysChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Attendance Dates</label>
                  <button
                    type="button"
                    onClick={autoFillEditDates}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Auto-fill sequential
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {Array.from({ length: editForm.numberOfDays }).map((_, index) => (
                    <input
                      key={index}
                      type="date"
                      required
                      value={editForm.dates[index] || ''}
                      onChange={(e) => handleEditDateChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editForm.timeStart}
                    onChange={(e) => setEditForm({ ...editForm, timeStart: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editForm.timeEnd}
                    onChange={(e) => setEditForm({ ...editForm, timeEnd: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

