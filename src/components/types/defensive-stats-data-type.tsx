export interface DefensiveListApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: PaginationMeta
  data: DefensiveStats[]
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}


export interface DefensiveStats {
  _id: string
  player: Player
  tackleAttempts: string
  tackleSucceededPossession: string
  tackleSucceededNOPossession: string
  tackleFailed: string
  turnoverwon: string
  interceptions: string
  recoveries: string
  clearance: string
  totalBlocked: string
  shotBlocked: string
  crossBlocked: string
  mistakes: string
  aerialDuels: string
  phvsicalDuels: string 
  ownGoals: string
  createdAt: string
  updatedAt: string
  __v: number
}


export interface Player {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "player" | "admin"
  profileImage: string
  verified: boolean
  socialMedia: string[]
  playingVideo: string[]
  isSubscription: boolean
  subscription: string
  createdAt: string
  updatedAt: string
  __v: number
  lastLogin: string
  subscriptionExpiry: string
  agent: string
  birthdayPlace: string
  category: string
  citizenship: string
  currentClub: string
  dob: string
  foot: "right" | "left"
  gender: "male" | "female"
  hight: string
  inSchoolOrCollege: boolean
  league: string
  phone: string
  weight: string
  position: string[]
  teamName: string
  gpa: string
  institute: string
  provider: "google" | "credentials"
}


