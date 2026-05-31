export interface GetRevenueApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: Meta
  data: Payment[]
}

export interface Meta {
  total: number
  page: number
  limit: number
}


export interface Payment {
  _id: string
  user: User
  team: Team | null
  subscription: Subscription
  paypalOrderId?: string
  paypalCaptureId?: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  amount: number
  currency: "usd" | string
  status: "completed" | "pending" | "failed"
  paymentType: "Evaluation" | "Individual" | "Team" | string
  createdAt: string
  updatedAt: string
}

export interface Team {
  _id?: string;
  teamName?: string;
  coachName?: string;
  coachEmail?: string;
  category?: string;
  league?: string;
  players?: Player[];
  createdAt?: string;
}

export interface Player {
  _id: string;
  name: string;
  email: string;
  role: "player" | "gk";
  usedGames: number;
}


export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
  currentClub: string
  league: string
  category: string
  position: Position[]
  jerseyNumber: string
  teamName: string
  provider: string
  phone: string
  phoneCode: string
  citizenship: string
  nationality: string
  gender: string
  age: number
  dob: string
  foot: string
  hight: string
  weight: string
  agent: string
  gpa: string
  birthdayPlace: string
  inSchoolOrCollege: boolean
  institute: string
  schoolName: string
  isSubscription: boolean
  isEvaluation: boolean
  isDevelopment: boolean
  playingVideo: string[]
  verified: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type Position = "lb" | "rb" | "cb" | "gk" | "lw" | "rw" | string


export interface Subscription {
  _id: string
  title: string
  price: number
  currency: string
  features: string[]
  paymentType: string
  numberOfGames: number | null
  evaluationLimit: number
  status: string
  isActive: boolean
  description: string
  interval: string
  createdAt: string
  updatedAt: string
}
