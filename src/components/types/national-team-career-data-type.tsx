export interface NationalTeamApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: NationalTeam[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}


export interface NationalTeam {
  _id: string;
  player: Player;
  flag: string;
  teamName: string;
  category: string;
  debut: string; 
  match: string;
  goals: string;
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
  inSchoolOrCollege: boolean;
  league: string;
  phone: string;
  weight: string;
  position: PlayerPosition[];
  teamName: string;
  gpa: string;
  institute: string;
  provider: "google" | "credentials" | string;
  __v: number;
}

export type PlayerPosition = "rb" | "gk" | "lb" | "cb" | "cm" | "cf" | string;
