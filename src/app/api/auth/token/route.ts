import { HttpError } from "@/lib/http";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  const { accessToken, refreshToken } = body;
  const cookieStore = await cookies();

  try {
    const decodedAccessToken = decode(accessToken) as { exp: number };
    const decodedRefreshToken = decode(refreshToken) as { exp: number };
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "Có lỗi xảy ra" }, { status: 500 });
    }
  }
}
