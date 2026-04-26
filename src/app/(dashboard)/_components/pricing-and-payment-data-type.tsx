export interface PricingAndPaymentApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Payment[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}


export interface Payment {
  _id: string;
  team: Team | null;
  user: User | null;
  subscription: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  paymentType: "Individual" | "TeamGame";
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "player" | "gk" | "guest" | "coach";
  provider: string;
  profileImage: string;
  verified: boolean;

  position: string[];
  socialMedia: string[];
  playingVideo: string[];

  isSubscription: boolean;
  subscription: string;
  subscriptionExpiry: string;

  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  __v: number;

  birthdayPlace?: string;
  category?: string;
  citizenship?: string;
  currentClub?: string;
  dob?: string;
  foot?: string;
  gender?: string;
  gpa?: string;
  hight?: string;
  inSchoolOrCollege?: boolean;
  institute?: string;
  league?: string;
  weight?: string;
  jerseyNumber?: string;
  teamName?: string;
}

export interface Team {
  _id: string;
  teamName: string;
  coachName: string;
  coachEmail: string;
  category: string;
  league: string;
  players: TeamPlayer[];
  subscription: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface TeamPlayer {
  _id: string;
  name: string;
  email: string;
  role: "player" | "gk";
  usedGames: number;
}

