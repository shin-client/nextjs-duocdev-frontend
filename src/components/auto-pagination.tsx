import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchParamsLoader, {
  useSearchParamsLoader,
} from "@/components/search-params-loader";

interface Props {
  page: number;
  pageSize: number;
  pathname?: string;
  isLink?: boolean;
  onClick?: (pageNumber: number) => void;
}

const RANGE = 2;
export default function AutoPagination({
  page,
  pageSize,
  pathname,
  isLink = true,
  onClick = () => {},
}: Props) {
  const { searchParams, setSearchParams } = useSearchParamsLoader();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams ?? "");
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;

        // Điều kiện để return về ...
        if (
          page <= RANGE * 2 + 1 &&
          pageNumber > page + RANGE &&
          pageNumber < pageSize - RANGE + 1
        ) {
          return renderDotAfter();
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore();
          } else if (
            pageNumber > page + RANGE &&
            pageNumber < pageSize - RANGE + 1
          ) {
            return renderDotAfter();
          }
        } else if (
          page >= pageSize - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore();
        }

        return (
          <PaginationItem key={index}>
            {isLink ? (
              <PaginationLink
                href={createPageUrl(pageNumber)}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            ) : (
              <Button
                onClick={() => {
                  onClick(pageNumber);
                }}
                variant={pageNumber === page ? "outline" : "ghost"}
                className="h-9 w-9 p-0"
              >
                {pageNumber}
              </Button>
            )}
          </PaginationItem>
        );
      });
  };

  return (
    <Pagination>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <PaginationPrevious
              href={createPageUrl(page - 1)}
              className={cn({
                "cursor-not-allowed": page === 1,
              })}
              onClick={(e) => {
                if (page === 1) {
                  e.preventDefault();
                }
              }}
            />
          ) : (
            <Button
              className={cn("h-9 w-9 p-0", {
                "cursor-not-allowed": page === 1,
              })}
              variant={"ghost"}
              onClick={() => {
                onClick(page - 1);
              }}
              disabled={page === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          {isLink ? (
            <PaginationNext
              href={createPageUrl(page + 1)}
              className={cn({
                "cursor-not-allowed": page === pageSize,
              })}
              onClick={(e) => {
                if (page === pageSize) {
                  e.preventDefault();
                }
              }}
            />
          ) : (
            <Button
              className={cn("h-9 w-9 p-0", {
                "cursor-not-allowed": page === pageSize,
              })}
              variant={"ghost"}
              onClick={() => {
                onClick(page + 1);
              }}
              disabled={page === pageSize}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
