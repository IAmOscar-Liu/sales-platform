import SimpleSearch from "@/components/search/SimpleSearch";
import PaginationController from "@/components/table/PaginationController";
import { SortableTable } from "@/components/table/SortableTable";
import TableLayout from "@/components/table/TableLayout";
import { QUERIES, TIME_IN_MILLISECONDS } from "@/constants";
import SalesmanViewDialog from "@/features/salesman/components/SalesmanViewDialog";
import useErrorToast from "@/hooks/useErrorToast";
import { usePaginationData } from "@/hooks/usePaginationData";
import { supabase } from "@/lib/supabaseClient";
import { cn, formatDateTime } from "@/lib/utils";
import { type PageLink, PageTitle } from "@/routes/layouts/PageData";
import { type SearchQueries } from "@/types/response";
import { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

function Salesman() {
  const breadcrumbs: Array<PageLink> = useMemo(
    () => [
      {
        title: "Home",
        path: "/start",
        isSeparator: false,
        isActive: false,
      },
    ],
    [],
  );

  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs}>Salesman</PageTitle>
      <main className="px-8 py-6">
        <SalesmanTable />
      </main>
    </>
  );
}

function SalesmanTable({ className }: { className?: string }) {
  const [queryValue, updateQueryValue] = usePaginationData();
  const { data: salesmanData, isFetching, isLoading } = useSalesman(queryValue);
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<
    string | undefined
  >();
  const selectedSalesman = useMemo(() => {
    if (!salesmanData || !selectedSalesmanId) return undefined;
    return salesmanData.data.find((d) => d.id === selectedSalesmanId);
  }, [selectedSalesmanId]);
  const [isSalesmanViewDialogOpen, setIsSalesmanViewDialogOpen] =
    useState(false);

  const handleValueClick = (value: Tables<"users">) => {
    setSelectedSalesmanId(value.id);
    setIsSalesmanViewDialogOpen(true);
  };

  return (
    <div className={cn("p-2", className)}>
      <div className="flex items-center gap-3">
        <h1 className="me-auto text-2xl">Salesman</h1>
      </div>

      <div className="mt-4 flex h-full flex-col rounded-2xl border px-6 pt-4 shadow-md">
        <div className="flex flex-wrap items-center">
          <h2 className="text-xl">List</h2>
          <div className="ms-auto">
            <SimpleSearch
              updateQueryValue={updateQueryValue}
              placeholder="search salesman..."
            />
            <SalesmanViewDialog
              open={isSalesmanViewDialogOpen}
              setOpen={setIsSalesmanViewDialogOpen}
              data={selectedSalesman}
            />
          </div>
        </div>

        <TableLayout>
          {isFetching ? (
            <TableLayout.Loading />
          ) : (
            <TableLayout.Body>
              {(salesmanData?.data ?? []).length === 0 && (
                <TableLayout.NoData />
              )}
              {(salesmanData?.data ?? []).length > 0 && (
                <SortableTable
                  searchQuery={queryValue}
                  updateQueryValue={updateQueryValue}
                  data={salesmanData?.data ?? []}
                  columns={[
                    {
                      title: "Name",
                      value: (d) => d.name || "",
                      sortKey: "name",
                      valueClick: handleValueClick,
                    },
                    {
                      title: "Email",
                      value: (d) => d.email || "",
                      valueClick: handleValueClick,
                    },
                    {
                      title: "Region",
                      value: (d) => d.region || "",
                      valueClick: handleValueClick,
                    },
                    {
                      title: "Role",
                      value: (d) => d.role,
                      valueClick: handleValueClick,
                    },
                    {
                      title: "Created at",
                      value: (d) =>
                        d.created_at ? formatDateTime(d.created_at) : "",
                      valueClick: handleValueClick,
                    },
                  ]}
                />
              )}
            </TableLayout.Body>
          )}
          {!isLoading && (
            <PaginationController
              paginationValue={{
                ...queryValue,
                totalElements: salesmanData?.totalElements,
                totalPages: salesmanData?.totalPages,
              }}
              updateQueryValue={updateQueryValue}
            />
          )}
        </TableLayout>
      </div>
    </div>
  );
}

function useSalesman({
  page = 1,
  pageSize = 10,
  textSearch,
  sortBy,
  sortDesc,
}: SearchQueries) {
  const queryFn = async () => {
    const query = supabase.from("users").select("*", { count: "exact" });

    // text search, assuming you want to search a "name" column for example:
    if (textSearch) {
      // query.ilike("name", `%${textSearch}%`);
      query.or(`name.ilike.%${textSearch}%,email.ilike.%${textSearch}%`);
    }
    // ordering
    if (sortBy && sortDesc) {
      query.order(sortBy, { ascending: !sortDesc });
    }
    // pagination
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    query.range(from, to);

    // execute
    const { data, count, error } = await query;

    if (error) throw error;

    return {
      data: data ?? [],
      totalElements: count ?? 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    };
  };

  const query = useQuery({
    queryKey: [
      QUERIES.salesman,
      {
        page,
        pageSize,
        textSearch,
        sortBy,
        sortDesc,
      },
    ],
    queryFn,
    staleTime: TIME_IN_MILLISECONDS.fiveMinutes,
  });
  useErrorToast(query.error);
  return query;
}

export default Salesman;
