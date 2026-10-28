import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions, createAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const enteredUsername = (username || "").trim().toLowerCase();
    const enteredPassword = (password || "").trim();

    const targetUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const targetPassword = process.env.ADMIN_PASSWORD;
    if (!targetUsername || !targetPassword || !process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json({ success: false, error: 'Admin login is not configured. Please contact the site administrator.' }, { status: 503 });
    }

    if (enteredUsername === targetUsername && enteredPassword === targetPassword) {
      const session = createAdminSession();
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE_NAME, session.value, adminCookieOptions(session.maxAge));
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials. Please make sure there are no typos." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server validation failure." },
      { status: 500 }
    );
  }
}
