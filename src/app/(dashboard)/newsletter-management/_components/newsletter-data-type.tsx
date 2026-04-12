export type Newsletter = {
  _id: string;
  email: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type NewsletterMeta = {
  page: number;
  limit: number;
  total: number;
};

export type NewsletterApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: NewsletterMeta;
  data: Newsletter[];
};