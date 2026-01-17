// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Sort types
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Common result type for operations
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ID type (can be changed to branded type later)
export type ID = string;
