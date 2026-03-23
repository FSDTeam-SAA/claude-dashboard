
export interface AttackingStatApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: Meta
  data: AttackingStat[]
}


export interface Meta {
  total: number
  page: number
  limit: number
}

export interface AttackingStat {
  _id: string
  player: Player
  goals: string
  assists: string
  shotsNsidePr: string
  shotsOutsidePa: string
  totalShots: string
  shotsOnTarget: string
  shootingAccuracy: string
  shotsOffTarget: string
  passesAccuracy: string
  takeOn: string 
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Player {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "player" | string
  provider: "credentials" | string
  profileImage: string
  verified: boolean
  position: string[]
  playingVideo: string[]
  isSubscription: boolean
  createdAt: string
  updatedAt: string
  __v: number
  lastLogin: string
  birthdayPlace: string
  category: string
  citizenship: string
  currentClub: string
  dob: string
  foot: "left" | "right" | string
  gender: "male" | "female" | string
  gpa: string
  hight: string
  inSchoolOrCollege: boolean
  institute: string
  league: string
  weight: string
}


