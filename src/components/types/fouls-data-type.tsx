export interface FoulsPlayer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  verified: boolean;
  socialMedia: string[];
  playingVideo: string[];
  isSubscription: boolean;
  subscription: string;
  accessLavel: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin: string;
  subscriptionExpiry: string;
  agent: string;
  birthdayPlace: string;
  category: string;
  citizenship: string;
  currentClub: string;
  dob: string;
  foot: string;
  gender: string;
  hight: string;
  inSchoolOrCollege: boolean;
  league: string;
  phone: string;
  weight: string;
  position: string[];
  teamName: string;
  gpa: string;
  institute: string;
  provider: string;
}

export interface FoulsData {
  _id: string;
  player: FoulsPlayer;
  fouls: string;
  foulswon: string;
  redCards: string;
  yellowCards: string;
  offside: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FoulsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: FoulsData[];
}
