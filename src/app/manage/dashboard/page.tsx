import accountApiRequest from "@/apiRequests/account"
import { cookies } from "next/headers"

const Dashboard = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value as string;
  const result = await accountApiRequest.sMe(accessToken)
  return (
    <div>Xin chào {result.payload.data.name}</div>
  )
}
export default Dashboard