import dishApiRequest from "@/apiRequests/dish";
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// TODO: fix chỉ lấy những món phổ biến!
export async function generateStaticParams() {
  const res = await dishApiRequest.list();
  return res.payload.data.map((dish: { name: string; id: number }) => ({
    slug: generateSlugUrl({ name: dish.name, id: dish.id }),
  }));
}

const DishPage = async ({ params }: Props) => {
  const { slug } = await params;
  const id = getIdFromSlugUrl(slug);

  const data = await wrapServerApi(() => dishApiRequest.getDish(id));
  const dish = data?.payload.data;

  if (!dish) {
    notFound();
  }

  return <DishDetail dish={dish} />;
};
export default DishPage;
