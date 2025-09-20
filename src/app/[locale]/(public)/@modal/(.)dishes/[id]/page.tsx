import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "@/app/[locale]/(public)/dishes/[id]/dish-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const res = await dishApiRequest.list();
  return res.payload.data.map((dish) => ({ dish }));
}

const DishPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
};
export default DishPage;
