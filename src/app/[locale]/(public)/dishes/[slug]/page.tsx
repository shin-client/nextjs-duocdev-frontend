import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await dishApiRequest.list();
  return res.payload.data.map((dish: { id: number }) => ({
    id: dish.id.toString(),
  }));
}

const DishPage = async ({ params }: Props) => {
  const { slug } = await params;
  const id = getIdFromSlugUrl(slug);

  const data = await wrapServerApi(() => dishApiRequest.getDish(id));
  const dish = data?.payload.data;

  return <DishDetail dish={dish} />;
};
export default DishPage;
