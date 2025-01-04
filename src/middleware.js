import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const sesion = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;
  const publicPaths = ["/auth/login", "/unauthorized"];
  const isAuthApi = url.startsWith("/api/auth");
  if (publicPaths.includes(url) || isAuthApi) {
    return NextResponse.next();
  }

  if (!sesion) {
    console.log("No sesión registrada", sesion);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = sesion.role;

  switch (role) {
    case "it":
      return NextResponse.next();
    case "admin":
      const authorizeDirectionsAdm = [
        "/administration",
        "/medical-services",
        "/auth",
        "/medical-history",
        "/register",
        "/",
      ];
      if (authorizeDirectionsAdm.includes(url)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    case "nurse":
      const authorizeDirectionsN = [
        "/medical-services",
        "/medical-services/listOfServices",
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
        "/medical-services",
        "register",
        "/",
        "/noursing",
        "/medical-appointment",
        "/medical-history",
      ];
      if (authorizeDirectionsD.includes(url)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    default:
      return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

/*export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};*/
export const config = {
  matcher: [
    "/",
    "/medical-services/:path*",
    "/administration/:path*",
    "/api",
    "/auth/:path*",
    "/medical-appointment/:path*",
    "/medical-history/:path*",
    "/noursing/:path*",
    "/register/:path*",
  ],
};
