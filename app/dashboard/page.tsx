'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    users: 0,
    fields: 0,
    subjects: 0,
    attendances: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, fieldsRes, subjectsRes, attendancesRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/fields'),
          fetch('/api/admin/subjects'),
          fetch('/api/admin/attendances'),
        ])

        const usersData = await usersRes.json()
        const fieldsData = await fieldsRes.json()
        const subjectsData = await subjectsRes.json()
        const attendancesData = await attendancesRes.json()

        setStats({
          users: usersData.users?.length || 0,
          fields: fieldsData.fields?.length || 0,
          subjects: subjectsData.subjects?.length || 0,
          attendances: attendancesData.attendances?.length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Fields</h2>
          <p className="text-3xl font-bold text-green-600">{stats.fields}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Subjects</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.subjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Attendances</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.attendances}</p>
        </div>
      </div>
    </div>
  )
}

