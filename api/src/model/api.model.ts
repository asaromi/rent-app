export class Pagination {
  current_page: number
  total: number
  per_page: number
}

export class ApiError {
  code: string
  message: string
  details?: Array<{ field: string; message: string }>
}

export class ApiResponse<T> {
  success: boolean
  data?: T
  meta?: Pagination
  error?: ApiError
}
