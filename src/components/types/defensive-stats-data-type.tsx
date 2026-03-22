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
  tackleAttempts: number
  tackleSucceededPossession: number
  tackleSucceededNOPossession: number
  tackleFailed: number
  turnoverwon: number
  interceptions: number
  recoveries: number
  clearance: number
  totalBlocked: number
  shotBlocked: number
  crossBlocked: number
  mistakes: number
  aerialDuels: string
  phvsicalDuels: string 
  ownGoals: number
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



