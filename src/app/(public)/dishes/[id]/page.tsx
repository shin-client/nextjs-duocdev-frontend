import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

const DishPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  if (!dish) {
    return (
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">
          Món ăn không tồn tại
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold lg:text-3xl">{dish.name}</h1>
      <p className="font-semibold text-orange-600">
        {formatCurrency(dish.price)} VNĐ
      </p>
      <Image
        priority
        src={dish.image ?? ""}
        width={700}
        height={700}
        quality={100}
        className="h-full max-h-[1080px] w-full max-w-[1080px] rounded-md object-cover"
        alt={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
};
export default DishPage;
