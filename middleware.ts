import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

const publicPaths = ["/", "/settings"];

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  async (req: NextRequest) => {
    return intlMiddleware(req);
  },
  {
    publicPaths: [
      "/",
      "/settings",
      "/en",
      "/en/settings",
      "/my",
      "/my/settings",
    ],
  }
);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPaths
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  if (isPublicPage) {
    return intlMiddleware(req);
  }
  return (authMiddleware as any)(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
