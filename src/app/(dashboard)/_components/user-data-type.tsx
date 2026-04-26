export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "player" | "gk" | "guest" | "coach";
  // role: string;
  profileImage: string;
  verified: boolean;

  league: string | null;
  category: string | null;

  position: string[];
  socialMedia: string[];
  playingVideo: string[];

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  __v: number;

  // Optional fields (present in some users)
  otp?: string;
  otpExpiry?: string;

  agent?: string;
  birthdayPlace?: string;
  citizenship?: string;
  currentClub?: string;
  dob?: string; // ISO string
  foot?: string;
  gender?: string;
  gpa?: string;
  hight?: string;
  inSchoolOrCollege?: boolean;
  phone?: string;
  phoneCode?: string;
  satAct?: string;
  weight?: number;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}

export interface UserManagementApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: UserInfo[];
}
