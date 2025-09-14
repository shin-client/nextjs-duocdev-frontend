import { NextRequest, NextResponse } from "next/server";
import { Role } from "./constants/type";
import { decodeJwt } from "jose";
import { TokenPayload } from "./types/jwt.types";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const manageRoutes = ["/manage"];
const guestRoutes = ["/guest"];
const onlyOwnerRoutes = ["/manage/accounts"];
const unAuthRoutes = ["/login"];
const publicRoutes = ["/"];

const privateRoutes = [...manageRoutes, ...guestRoutes];

const stripLocalePrefix = (pathname: string) => {
  const segs = pathname.split("/");
  const maybeLocale = segs[1];
  return routing.locales.includes(
    maybeLocale as (typeof routing.locales)[number],
  )
    ? `/${segs.slice(2).join("/")}`
    : pathname;
};

const decodeToken = (token: string) => {
  return decodeJwt(token) as TokenPayload;
};

const i18nMiddleware = createMiddleware(routing);

const middleware = async (request: NextRequest) => {
  const i18nRes = i18nMiddleware(request);
  const base = i18nRes ?? NextResponse.next();

  const { pathname } = request.nextUrl;
  const pathNoLocale = stripLocalePrefix(pathname);
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.includes(pathNoLocale);
  if (isPublicRoute) return base;

  // Chưa login thì không cho vào privatePaths
  if (
    privateRoutes.some((path) => pathNoLocale.startsWith(path)) &&
    !refreshToken
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // Đã login
  if (refreshToken) {
    // Không cho vào unAuthPaths
    if (unAuthRoutes.some((path) => pathNoLocale.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Hết hạn access token
    if (
      privateRoutes.some((path) => pathNoLocale.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathNoLocale);
      return NextResponse.redirect(url);
    }

    // Vào không đúng role, redirect về home
    const role = decodeToken(refreshToken).role;

    const isUnauthorizedAccess = () => {
      if (role === Role.Guest)
        return manageRoutes.some((path) => pathNoLocale.startsWith(path));
      else if (role !== Role.Owner)
        return onlyOwnerRoutes.some((path) => pathNoLocale.startsWith(path));
      return guestRoutes.some((path) => pathNoLocale.startsWith(path));
    };

    if (isUnauthorizedAccess()) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return base;
};

export default middleware;

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
