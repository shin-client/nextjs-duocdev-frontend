import { NextRequest, NextResponse } from "next/server";
import { Role } from "./constants/type";
import { decodeJwt } from "jose";
import { TokenPayload } from "./types/jwt.types";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const managePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/vi/login", "/en/login"];
const publicRoutes = ["/"];

const decodeToken = (token: string) => {
  return decodeJwt(token) as TokenPayload;
};

const i18nMiddleware = createMiddleware(routing);

const authMiddleware = async (request: NextRequest, response: NextResponse) => {
  const { pathname } = request.nextUrl;
  const [, locale, ...segments] = pathname.split("/");
  const basePathname = `/${segments.join("/")}`;

  console.log("basePathname", basePathname);
  console.log("locale", locale);
  console.log("segments", segments);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.includes(basePathname);
  if (isPublicRoute) {
    return response;
  }

  // Chưa login thì không cho vào privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // Đã login
  if (refreshToken) {
    // Không cho vào unAuthPaths
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Hết hạn access token
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Vào không đúng role, redirect về home
    const role = decodeToken(refreshToken).role;

    const isUnauthorizedAccess = () => {
      if (role === Role.Guest)
        return managePaths.some((path) => pathname.startsWith(path));
      else if (role !== Role.Owner)
        return onlyOwnerPaths.some((path) => pathname.startsWith(path));
      return guestPaths.some((path) => pathname.startsWith(path));
    };

    if (isUnauthorizedAccess()) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
};

const middleware = async (request: NextRequest) => {
  const response = i18nMiddleware(request);

  if (response && !response.ok) {
    return response;
  }
  return await authMiddleware(request, response);
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|favicon.ico|sitemap.xml|robots.txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default middleware;
