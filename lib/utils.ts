import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isDateInRange(date: string, dates: string[]): boolean {
  return dates.includes(date)
}

export function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
  const [currentHour, currentMin] = currentTime.split(':').map(Number)
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const current = currentHour * 60 + currentMin
  const start = startHour * 60 + startMin
  const end = endHour * 60 + endMin

  return current >= start && current <= end
}

