import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/forgot-password/otp",
  "/forgot-password/otp/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


















// import { getToken } from "next-auth/jwt";
// import { NextResponse, NextRequest } from "next/server";

// const PUBLIC_ROUTES = [
//   "/login",
//   "/forgot-password",
//   "/forgot-password/otp",
//   "/forgot-password/reset-password",
//   "/favicon.ico",
//   "/api",
//   "/_next/static",
//   "/_next/image",
// ];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   // console.log("token +++++++++++++++++=", token);
//   // console.log( "role------------------", token?.role);

//   if (!token || token?.role !== "admin") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!favicon.ico|api|_next/static|_next/image).*)"],
// };



