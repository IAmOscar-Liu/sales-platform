export type ApiResponse<T> =
  | {
      success: true;
      statusCode?: number;
      data: T;
    }
  | {
      success: false;
      statusCode?: number;
      message: any;
    };

export type ApiPaginationResponse<T> =
  | {
      success: true;
      statusCode?: number;
      data: PaginationResponse<T>;
    }
  | {
      success: false;
      statusCode?: number;
      message: any;
    };

export type PaginationResponse<T> = {
  code?: number;
  occurTime?: string;
  message?: any;
  data: T[];
  totalPages: number;
  totalElements: number;
};

export const SEARCH_QUERY_PAGE_SIZE_SELECTIONS = [
  5, 10, 25, 50, 100, 1000,
] as const;

export type PageSize = (typeof SEARCH_QUERY_PAGE_SIZE_SELECTIONS)[number];

export interface SearchQueries {
  page?: number;
  pageSize?: PageSize;
  sortBy?: string;
  sortDesc?: boolean;
  textSearch?: string;
  companyId?: string;
  status?: string[];
}

// export interface PaginationValue
//   extends Omit<SearchQueries, "pageSize" | "page"> {
//   totalPages: number;
//   totalElements: number;
//   pageSize: PageSize;
//   page: number;
// }

export interface PaginationValue extends SearchQueries {
  totalPages?: number;
  totalElements?: number;
}
