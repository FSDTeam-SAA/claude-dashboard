export interface RatingsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Rating[];
}


export interface Meta {
  page: number;
  limit: number;
  total: number;
}


export interface Rating {
  _id: string;
  player: Player;
  rating: number;
  position: string[];
  date: string;
  gamesNumber: number;
  minutes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "player" | string;
  profileImage: string;
  verified: boolean;

  socialMedia: string[];
  playingVideo: string[];

  isSubscription: boolean;
  subscription: string;
  accessLavel: string[];

  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  subscriptionExpiry: string;

  agent: string;
  birthdayPlace: string;
  category: string;
  citizenship: string;
  currentClub: string;
  dob: string;

  foot: "right" | "left" | string;
  gender: "male" | "female" | string;

  hight: string;
  weight: string;

  inSchoolOrCollege: boolean;
  league: string;
  phone: string;

  position: string[];
  teamName: string;
  gpa: string;
  institute: string;
  provider: "google" | "credentials" | string;

  __v: number;
}
