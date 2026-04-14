export interface PaginationParams {
  page:  number;
  limit: number;
  skip:  number;
}

export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}

/**
 * Parse and sanitise pagination query params.
 * Defaults: page=1, limit=20, max limit=100
 */
export function parsePagination(
  rawPage?: string | number,
  rawLimit?: string | number,
): PaginationParams {
  const page  = Math.max(1, parseInt(String(rawPage  ?? 1)));
  const limit = Math.min(100, Math.max(1, parseInt(String(rawLimit ?? 20))));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
