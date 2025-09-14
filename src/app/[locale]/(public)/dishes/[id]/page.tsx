import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

interface Props {
  params: Promise<{ id: string }>;
}

const DishPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  return <DishDetail dish={dish} />;
};
export default DishPage;
