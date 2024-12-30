import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
    console;
  }

  const role = token.role;
  if (role === "it") {
    return NextResponse.next();
  }
  if (role === "admin") {
    if (url.startsWith("/api")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  if (role === "nourse") {
    const allowedRoutes = ["/nursing", "/medicalAppointment", "/services", "/"];
    if (!allowedRoutes.includes(url)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/unauthorized", req.url));
}
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/"],
};
