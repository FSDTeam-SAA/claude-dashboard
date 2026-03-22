export interface PlayerDistributionStatsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: DistributionStats[];
}


export interface Meta {
  total: number;
  page: number;
  limit: number;
}


export interface DistributionStats {
  _id: string;
  gk: GkUser;

  passes: string;
  passesinFinalThird: string;
  passesinMiddleThird: string;
  passesinOerensiveThird: string;

  kevPasses: string;
  longPasses: string;
  mediumPasses: string;
  shortPasses: string;

  passesForward: string;
  passesSidewavs: string;
  passesBackward: string;

  passesReceived: string;
  crosses: string;
  stepIn: string;
  turnoverConceded: string;
  mostPassesPlayerBetween: string;
  passTheMost: string;
  ballTheMost: string;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
}


export interface GkUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "gk";
  profileImage: string;
  verified: boolean;
  socialMedia: string[];
  playingVideo: string[];
  isSubscription: boolean;
  subscription: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  position: string[];
  provider: "google" | "credentials";
  __v: number;
}


