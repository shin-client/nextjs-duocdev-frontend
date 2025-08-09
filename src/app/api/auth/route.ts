export const dynamic = "force-static";

export async function POST(request: Request) {
  const res = await request.json();
  console.log("route", res);
  const sessionToken = res?.payload?.data?.refreshToken;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      { status: 400 },
    );
  }
  return Response.json(
    { res },
    {
      status: 200,
      headers: { "Set-Cookie": `sessionToken=${sessionToken}; Path=/` },
    },
  );
}
