import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import { Info, ShoppingCart, TriangleAlert } from "lucide-react";
import Image from "next/image";

interface Props {
  dish: DishResType["data"] | undefined;
}

const DishDetail = async ({ dish }: Props) => {
  if (!dish) {
    return (
      <div className="flex items-center justify-center">
        <div className="p-8 text-center">
          <TriangleAlert className="mx-auto mb-2 flex h-10 w-10 items-center justify-center" />
          <h1 className="mb-2 text-2xl font-bold">Món ăn không tồn tại!</h1>
          <p>Xin lỗi, chúng tôi không tìm thấy món ăn bạn đang tìm kiếm.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <Image
            priority
            src={dish.image ?? ""}
            width={700}
            height={700}
            quality={100}
            className="h-full w-full rounded-xl object-cover"
            alt={dish.name}
          />

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-bold lg:text-5xl">
                {dish.name}
              </h1>
            </div>

            <div>
              <p className="text-md mb-1 opacity-90">Giá</p>
              <p className="text-3xl font-bold">
                {formatCurrency(dish.price)} VNĐ
              </p>
            </div>

            <div className="rounded-2xl">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Info className="text-orange-500" />
                <span>Mô tả món ăn</span>
              </h3>
              <p className="text-lg leading-relaxed">{dish.description}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="flex-1 transform cursor-pointer rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <ShoppingCart />
                  <span>Thêm vào giỏ hàng</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DishDetail;
