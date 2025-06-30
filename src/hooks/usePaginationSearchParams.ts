import { useSearchParams } from "react-router-dom";
import { type PageSize, type SearchQueries } from "../types/response";
import { useState, useEffect } from "react";

export function usePaginationSearchParams(initialSearchQueries: SearchQueries) {
  const [params, setParams] = useSearchParams();

  const [value, setValue] = useState<SearchQueries>(() => {
    if (
      params.get("page") ||
      params.get("pageSize") ||
      params.get("sortBy") ||
      params.get("sortDesc") ||
      params.get("textSearch") ||
      params.get("companyId") ||
      params.get("status")
    )
      return {
        ...(params.get("page") ? { page: +params.get("page")! } : {}),
        ...(params.get("pageSize")
          ? { pageSize: +params.get("pageSize")! as PageSize }
          : {}),
        ...(params.get("sortBy") ? { sortBy: params.get("sortBy")! } : {}),
        ...(params.get("sortDesc")
          ? { sortDesc: params.get("sortDesc") === "true" }
          : {}),
        ...(params.get("textSearch")
          ? { textSearch: params.get("textSearch")! }
          : {}),
        ...(params.get("companyId")
          ? { companyId: params.get("companyId")! }
          : {}),
        ...(params.get("status")
          ? { status: params.get("status")!.split(",") }
          : {}),
      };
    return initialSearchQueries;
  });

  useEffect(() => {
    setParams(
      {
        ...(value.page ? { page: value.page + "" } : {}),
        ...(value.pageSize ? { pageSize: value.pageSize + "" } : {}),
        ...(value.sortBy ? { sortBy: value.sortBy + "" } : {}),
        ...(value.sortDesc !== undefined
          ? { sortDesc: value.sortDesc ? "true" : "false" }
          : {}),
        ...(value.textSearch ? { textSearch: value.textSearch + "" } : {}),
        ...(value.companyId ? { companyId: value.companyId + "" } : {}),
        ...(value.status ? { status: value.status.join(",") } : {}),
      },
      { replace: true }
    );
  }, [value]);

  return [value, setValue] as const;
}
