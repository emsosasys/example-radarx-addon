export interface User {
  sub: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  photoURL: string
  refresh_token?: string
  role?: string
  is_active?: boolean
}

export interface RadarXProfile {
  id: string
  Role: RadarXRole
  School: RadarXSchool
  is_active: boolean
}

export interface RadarXRole {
  id: string
  name: string
}

export interface RadarXSchool {
  id: string
  name: string
  address: string | null
  cord_lat: string | null
  cord_lon: string | null
  orgUnit: string
}
