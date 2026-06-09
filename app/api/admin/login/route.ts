import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const enteredUsername = (username || "").trim().toLowerCase();
    const enteredPassword = (password || "").trim();

    // Default authenticating coordinates
    const defaultUsername = 'Garudautomobiles';
    const defaultPassword = 'garudautomobiles@1512025';

    // Retrieve environment values from server-side environment (guaranteed never visible to the client browser)
    const targetUsername = (process.env.ADMIN_USERNAME || defaultUsername).trim().toLowerCase();
    const targetPassword = (process.env.ADMIN_PASSWORD || defaultPassword).trim();

    if (enteredUsername === targetUsername && enteredPassword === targetPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials. Please make sure there are no typos." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server validation failure." },
      { status: 500 }
    );
  }
}
