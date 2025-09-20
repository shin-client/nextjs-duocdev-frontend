import dishApiRequest from "@/apiRequests/dish";
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/config";
import envConfig from "@/config";

interface Props {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: "DishPage",
  });

  const id = getIdFromSlugUrl((await params).slug);
  const data = await dishApiRequest.getDish(id);
  const dish = data?.payload.data;

  if (!dish) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }

  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${(await params).locale}/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`;

  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      title: dish.name,
      description: dish.description,
      url,
      images: [{ url: dish.image ?? "" }],
    },
    alternates: {
      canonical: url,
    },
  };
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
