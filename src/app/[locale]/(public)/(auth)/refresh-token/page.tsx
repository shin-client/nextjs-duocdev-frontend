import RefreshToken from "./refresh-token";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

const RefreshTokenPage = () => {
  return <RefreshToken />;
};

export default RefreshTokenPage;
