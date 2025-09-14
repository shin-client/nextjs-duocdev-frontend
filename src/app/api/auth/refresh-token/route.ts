import authApiRequest from "@/apiRequests/auth";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { message: "Không tìm thấy refresh token!" },
      { status: 401 },
    );
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });
    const decodedAccessToken = decodeJwt(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = decodeJwt(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set({
      name: "accessToken",
      value: payload.data.accessToken,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set({
      name: "refreshToken",
      value: payload.data.refreshToken,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Có lỗi xảy ra" },
      { status: 401 },
    );
  }
}
