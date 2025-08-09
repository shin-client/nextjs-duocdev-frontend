import envConfig from "@/config";
import { cookies } from "next/headers";

const MeProfile = async () => {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken");
  console.log(sessionToken);
  const result = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/accounts/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  ).then(async (res) => {
    const payload = await res.json();
    const data = {
      result: res.status,
      payload,
    };
    if (!res.ok) throw data;
    return data;
  });
  console.log(result);
  return (
    <div>
      <h1>Profile</h1>
      <div>Xin chào </div>
    </div>
  );
};
export default MeProfile;
