// Single Coupon Type
export type Coupon = {
  _id: string;
  code: string;
  discountType: "percent" | "fixed" | string;
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  appliesTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
};

export type CouponApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Coupon[];
};
