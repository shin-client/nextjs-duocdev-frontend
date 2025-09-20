"use client";

import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type SearchParamsLoaderProps = {
  onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

function SearchParamsContent({ onParamsReceived }: SearchParamsLoaderProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParamsReceived(searchParams);
  }, [searchParams, onParamsReceived]);

  return null;
}

export default function SearchParamsLoader(props: SearchParamsLoaderProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsContent {...props} />
    </Suspense>
  );
}

export const useSearchParamsLoader = () => {
  const [searchParams, setSearchParams] =
    useState<ReadonlyURLSearchParams | null>(null);
  return { searchParams, setSearchParams };
};
