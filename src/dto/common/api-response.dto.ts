export class ApiResponseDto<T> {
  data?: T;
  message: string;
  success: boolean;
  timestamp: Date;

  constructor(data?: T, message = "Success", success = true) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.timestamp = new Date();
  }
}

export class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = "Success"
  ) {
    super(data, message);
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
