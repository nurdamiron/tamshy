import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const TOKEN_NAME = 'tamshy-token';

const PROTECTED_ROUTES: Record<string, string[] | null> = {
  '/jury': ['JURY', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/cabinet': null, // any authenticated user
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (!matchedEntry) return NextResponse.next();

  const [, requiredRoles] = matchedEntry;

  const token = req.cookies.get(TOKEN_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // null means any authenticated user is allowed
    if (requiredRoles !== null) {
      const role = payload.role as string;
      if (!requiredRoles.includes(role)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/jury/:path*', '/admin/:path*', '/cabinet/:path*'],
};
