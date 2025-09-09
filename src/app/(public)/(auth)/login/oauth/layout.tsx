import LoadingFallback from "@/components/loading-fallback";
import { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};
export default layout;
