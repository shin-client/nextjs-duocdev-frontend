import tableApiRequest from "@/apiRequests/table";
import GuestLoginForm from "./guest-login-form";

export async function generateStaticParams() {
  const res = await tableApiRequest.list();
  return res.payload.data.map((table: { number: number }) => ({
    number: table.number.toString(),
  }));
}

export default function TableNumberPage() {
  return <GuestLoginForm />;
}
