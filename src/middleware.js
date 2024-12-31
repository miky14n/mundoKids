import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const sesion = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!sesion) {
    console.log("no sesion registrada", sesion);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const role = sesion.role;
  const url = req.nextUrl.pathname;

  switch (role) {
    case "it":
      return NextResponse.next();
    case "admin":
      const authorizeDirectionsAdm = [
        "/administration",
        "/medical_services",
        "/auth",
        "/medical-history",
        "/register",
        "/",
      ];
      if (authorizeDirectionsAdm.includes(url)) {
        return NextResponse.next();
      }
    case "nurse":
      const authorizeDirectionsN = [
        "/medical_services",
        "register",
        "/",
        "/noursing",
        "/medical-appointment",
      ];
      if (authorizeDirectionsN.includes(url)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    case "doctor":
      const authorizeDirectionsD = [
        "/medical_services",
        "register",
        "/",
        "/noursing",
        "/medical-appointment",
        "/medical-history",
      ];
      if (authorizeDirectionsD.includes(url)) {
        return NextResponse.next();
      }
    default:
      return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  console.log("la sesion", sesion);
}
export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/",
    "/medical_services",
    "/administration",
    "/api",
    "/auth",
    "/medical-appointment",
    "/medical-history",
    "/noursing",
    "/register",
  ],
};
