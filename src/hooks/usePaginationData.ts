import { type SearchQueries } from "@/types/response";
import { usePaginationSearchParams } from "./usePaginationSearchParams";

export function usePaginationData(_initialQueries?: SearchQueries) {
  const initialQueries = _initialQueries ?? {};
  const [queryValue, setQueryValue] = usePaginationSearchParams({
    ...initialQueries,
    page: initialQueries.page || 1,
    pageSize: initialQueries.pageSize || 10,
  });

  const updateQueryValue = (update: SearchQueries) => {
    if (
      (update.textSearch && update.textSearch !== queryValue.textSearch) ||
      (update.pageSize !== undefined &&
        update.pageSize !== queryValue.pageSize) ||
      update.sortBy !== undefined ||
      update.sortDesc != undefined ||
      (update.companyId && update.companyId !== queryValue.companyId) ||
      (update.status &&
        update.status.join(",") !== queryValue.status?.join(","))
    ) {
      return setQueryValue({ ...queryValue, ...update, page: 1 });
    }
    setQueryValue({ ...queryValue, ...update });
  };

  return [queryValue, updateQueryValue] as const;
}
