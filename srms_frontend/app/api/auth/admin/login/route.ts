import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    // backend: POST /admin/login :contentReference[oaicite:12]{index=12}
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`,
      body
    );

    const token = res.data?.token;
    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    const response = NextResponse.json({ token }, { status: 200 });

    response.cookies.set("admin_token", token, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.response?.data?.message || "Login failed" },
      { status: err.response?.status || 400 }
    );
  }
}
