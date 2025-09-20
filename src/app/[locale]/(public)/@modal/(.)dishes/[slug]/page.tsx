import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await dishApiRequest.list();
  return res.payload.data.map((dish) => ({ dish }));
}

const DishPage = async ({ params }: Props) => {
  const { slug } = await params;
  const id = getIdFromSlugUrl(slug);

  const data = await wrapServerApi(() => dishApiRequest.getDish(id));
  const dish = data?.payload.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
};
export default DishPage;
