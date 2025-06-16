// ! Weekly report
export interface WeeklyReport {
  students: Student[]
  legends: Legends[]
  dates: Dates
}

interface Dates {
  current: Date
  w4: Date
  [key: `${number}w`]: Date
}

interface Student {
  id: string
  fullname: string
  school: string
  is_active: string
  status: string
  enrolledAt: Date
  coursesData: Courses
  colors: Colors
}

interface Courses {
  current: number
  [key: `${number}w`]: number
}

interface Colors {
  current: string
  [key: `${number}w`]: string
}

// ! School Report

export interface SchoolReport {
  currentDate: Date
  students: StudentSchool[]
  legends: Legends[]
}

interface StudentSchool {
  id: string
  fullname: string
  school: string
  is_active: boolean
  path: {
    id: string
    title: string
  }
  status: string
  enrolledAt: Date
  progress: number
  color: string
  lastCourseCompleted: LastCourseCompleted | null
}

interface LastCourseCompleted {
  id: string
  title: string
  doneAt: Date
  elapsedTime: number
  Path: string
}

// ? Recycled interfaces

interface Legends {
  color: string
  range: string
}
