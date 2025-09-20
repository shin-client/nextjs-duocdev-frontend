import dishApiRequest from "@/apiRequests/dish";
import envConfig from "@/config";
import { DishStatus } from "@/constants/type";
import { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { formatCurrency, generateSlugUrl } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: "Metadata",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${(await params).locale}`;

  return {
    title: t("home.default"),
    description: t("home.description"),
    openGraph: {
      title: t("home.default"),
      description: t("home.description"),
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="w-full space-y-4">
      <section className="relative z-10">
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
            {t("title")}
          </h1>
          <p className="mt-4 text-center text-sm sm:text-base">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </section>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {dishList.map(
            (item) =>
              item.status !== DishStatus.Hidden && (
                <div className="w flex gap-4" key={item.id}>
                  <Link
                    href={`/dishes/${generateSlugUrl({ name: item.name, id: item.id })}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={item.image ?? ""}
                      width={150}
                      height={150}
                      quality={100}
                      className="h-[150px] w-[150px] rounded-md object-cover"
                      alt={item.name}
                    />
                  </Link>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="font-semibold text-orange-600">
                      {formatCurrency(item.price)} VNĐ
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      </section>
    </div>
  );
}
