import { Metadata } from "next";
import Logout from "./logout";

export const metadata: Metadata = {
  robots: { index: false },
};

const LogoutPage = () => {
  return <Logout />;
};

export default LogoutPage;
