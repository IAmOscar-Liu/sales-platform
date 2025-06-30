import {
  type PageSize,
  type PaginationValue,
  SEARCH_QUERY_PAGE_SIZE_SELECTIONS,
  type SearchQueries,
} from "@/types/response";
import { Fragment, useMemo, useRef } from "react";

import { useIntl } from "react-intl";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function PaginationController({
  className,
  paginationValue,
  updateQueryValue,
  onPaginationChange,
}: {
  className?: string;
  paginationValue?: Partial<PaginationValue>;
  updateQueryValue?: (update: SearchQueries) => void;
  onPaginationChange?: (page: number, pageSize: PageSize) => void;
}) {
  const { formatMessage: t } = useIntl();
  const pageInputRef = useRef<HTMLInputElement>(null);
  const {
    totalElements = 0,
    totalPages = 1,
    page = 1,
    pageSize = 10,
  } = paginationValue ?? {};
  const buttonPageGroups = useMemo(() => {
    const getResult = (): (number | string)[] => {
      const result = Array(totalPages)
        .fill(null)
        .map((_, idx) => idx + 1);

      if (totalPages <= 5) return result;
      if (page <= 3)
        return result.map((r) => (r > 4 && r < totalPages ? "truncate" : r));
      if (totalPages - page <= 2)
        return result.map((r) =>
          r > 1 && r < totalPages - 3 ? "truncate" : r
        );

      return result.map((r) =>
        r > 1 && r < page - 1
          ? "left truncate"
          : r > page + 2 && r < totalPages
            ? "right truncate"
            : r
      );
    };

    return getResult().reduce((acc: (number | string)[], cur) => {
      if (cur === acc.at(-1)) return acc;
      acc.push(cur);
      return acc;
    }, []);
  }, [totalPages, page]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-y-2",
        className
      )}
    >
      <p className="mb-0 flex items-center gap-1 text-sm">
        <span className="text-nowrap">
          {t({ id: "PAGINATION_CONTROLLER.EACH_PAGE" })}
        </span>{" "}
        <select
          name="select-num-of-entries"
          className="rounded-lg border bg-transparent px-1.5 py-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={pageSize + ""}
          onChange={(e) => {
            updateQueryValue &&
              updateQueryValue({
                pageSize: +e.target.value as PageSize,
              });
            onPaginationChange &&
              onPaginationChange(page, +e.target.value as PageSize);
          }}
        >
          {SEARCH_QUERY_PAGE_SIZE_SELECTIONS.filter(
            (selection) => selection >= 10 && selection <= 100
          ).map((selection) => (
            <option key={selection} value={selection}>
              {selection}
            </option>
          ))}
        </select>{" "}
        {t({ id: "PAGINATION_CONTROLLER.EACH_PAGE_UNIT" })}
      </p>
      <div className="flex-grow"></div>
      <form
        className="flex items-center text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          updateQueryValue &&
            updateQueryValue({
              page: +(pageInputRef?.current?.value || 1),
            });
          onPaginationChange &&
            onPaginationChange(+(pageInputRef?.current?.value || 1), pageSize);
        }}
      >
        <label className="me-2" htmlFor="pagination-page">
          <span className="text-nowrap">
            {t({ id: "PAGINATION_CONTROLLER.PAGE_NO" })}
          </span>
        </label>
        <input
          id="pagination-page"
          className="border-secondary-border w-[5ch] rounded-md border-[1px] bg-transparent px-1.5 py-1"
          ref={pageInputRef}
          type="number"
          key={page}
          defaultValue={page}
          min={1}
          max={totalPages}
        />
      </form>
      <div className="flex-grow"></div>
      <p className="text-sm">
        {t({ id: "PAGINATION_CONTROLLER.SHOW" })}{" "}
        <b>{(page - 1) * pageSize + 1}</b>{" "}
        {t({ id: "PAGINATION_CONTROLLER.TO" })}{" "}
        <b>{Math.min(page * pageSize, totalElements)}</b>{" "}
        {t({ id: "PAGINATION_CONTROLLER.OF" })} <b>{totalElements}</b>{" "}
        {t({ id: "PAGINATION_CONTROLLER.EACH_PAGE_UNIT" })}
      </p>
      <div className="flex-grow"></div>
      <nav>
        <ul className="flex gap-1">
          <li>
            <Button
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                if (page > 1) {
                  updateQueryValue && updateQueryValue({ page: page - 1 });
                  onPaginationChange && onPaginationChange(page - 1, pageSize);
                }
              }}
            >
              {t({ id: "PAGINATION_CONTROLLER.PREV_PAGE" })}
            </Button>
          </li>
          {buttonPageGroups.map((buttonValue) => (
            <Fragment key={buttonValue}>
              {typeof buttonValue === "number" ? (
                <li key={buttonValue}>
                  <Button
                    size="sm"
                    disabled={buttonValue === page}
                    onClick={() => {
                      updateQueryValue &&
                        updateQueryValue({ page: buttonValue });
                      onPaginationChange &&
                        onPaginationChange(buttonValue, pageSize);
                    }}
                  >
                    {buttonValue}
                  </Button>
                </li>
              ) : (
                <li className="flex items-center">&#8230;</li>
              )}
            </Fragment>
          ))}
          <li>
            <Button
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                if (page < totalPages) {
                  updateQueryValue && updateQueryValue({ page: page + 1 });
                  onPaginationChange && onPaginationChange(page + 1, pageSize);
                }
              }}
            >
              {t({ id: "PAGINATION_CONTROLLER.NEXT_PAGE" })}
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PaginationController;
