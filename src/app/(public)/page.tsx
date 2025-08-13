import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-50"></span>
        <Image
          priority
          src="/banner.png"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
        <div className="relative z-20 px-4 py-10 sm:px-10 md:px-20 md:py-20">
          <h1 className="text-center text-xl font-bold sm:text-2xl md:text-4xl lg:text-5xl">
            Nhà hàng Big Boy
          </h1>
          <p className="mt-4 text-center text-sm sm:text-base">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div className="w flex gap-4" key={index}>
                <div className="flex-shrink-0">=
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Bánh mì</h3>
                  <p className="">Bánh mì sandwidch</p>
                  <p className="font-semibold">123,123đ</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
