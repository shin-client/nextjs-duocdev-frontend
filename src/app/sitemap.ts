import dishApiRequest from "@/apiRequests/dish";
import envConfig from "@/config";
import { locales } from "@/i18n/config";
import { generateSlugUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

const createLocalizedSitemap = <T>(
  items: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapToSitemapEntry: (item: T, locale: string) => any,
) => {
  return (
    locales
      .map((locale) => items.map((item) => mapToSitemapEntry(item, locale)))
      .flat() || []
  );
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await dishApiRequest.list();
  const dishes = data?.payload.data;

  const localizeStaticSiteMap = createLocalizedSitemap(
    staticRoutes,
    (route, locale) => ({
      ...route,
      url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
      lastModified: new Date(),
    }),
  );

  const localizeDishSiteMap = createLocalizedSitemap(
    dishes,
    (dish, locale) => ({
      url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      lastModified: dish.updatedAt,
    }),
  );

  return [...localizeStaticSiteMap, ...localizeDishSiteMap];
}
