export interface UserApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: User
}





export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: "admin" | "user"
  provider: "credentials" | "google"
  profileImage: string
  verified: boolean
  phone: string
  phoneCode: string
  position: string[]
  schoolName: string;
  socialMedia: SocialMedia[];
  playingVideo: string[]
  agent: string
  age: number
  isSubscription: boolean
  subscription: Subscription | null
  accessLavel: string[]
  nationality: string
  birthdayPlace: string
  category: "professional" | "amateur"
  citizenship: string
  currentClub: string
  dob: string // ISO Date string
  foot: "right" | "left"
  gender: "male" | "female" | "other"
  gpa: string
  hight: string
  weight: string

  inSchoolOrCollege: boolean
  institute: string
  league: string

  createdAt: string
  updatedAt: string
  lastLogin: string
  __v: number
}







export interface SocialMedia {
  _id: string;
  name: string;
  url: string;
}

export interface Subscription {
  planId: string
  startDate: string
  endDate: string
  status: "active" | "expired" | "canceled"
}



