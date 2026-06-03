/** Matches backend ApiResponse class (statusCode, data, message) */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

/** Login endpoint uses a different shape */
export interface LoginApiResponse {
  success: boolean;
  data: { admin: unknown };
}

export interface PaginatedMeta {
  total: number;
  page: number;
  pages: number;
}
