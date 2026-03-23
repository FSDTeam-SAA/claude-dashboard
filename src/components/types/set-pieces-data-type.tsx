export interface SetpiecesApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: SetpiecesStats[];
}


export interface SetpiecesStats {
  _id: string;
  player: Player;
  freekicks: string;
  freekicksShots: string;
  freekicksShotsonTarget: string;
  penaltyKicks: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "player";
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
  foot: "right" | "left";
  gender: "male" | "female";
  hight: string;
  inSchoolOrCollege: boolean;
  league: string;
  phone: string;
  weight: string;
  position: string[];
  teamName: string;
  gpa: string;
  institute: string;
  provider: "google" | "credentials";
}

