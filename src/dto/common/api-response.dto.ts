import { Response } from "express";

export abstract class ApiResponseDto<T> {
  data?: T;
  message: string;
  success: boolean;
  statusCode: number;
  timestamp: Date;

  constructor(data?: T, message = "Success", success = true, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }

  // Métodos estáticos para facilitar a criação de respostas
  static success<T>(
    res: Response,
    data?: T,
    message = "Success",
    statusCode = 200
  ): Response {
    const response = new (class extends ApiResponseDto<T> {})(
      data,
      message,
      true,
      statusCode
    );
    return res.status(response.statusCode).json(response);
  }

  static warning<T>(
    res: Response,
    message = "Attention",
    statusCode = 400,
    data?: T
  ): Response {
    const response = new (class extends ApiResponseDto<T> {})(
      data,
      message,
      false,
      statusCode
    );
    return res.status(response.statusCode).json(response);
  }

  static error<T>(
    res: Response,
    message = "Error",
    statusCode = 400,
    data?: T
  ): Response {
    const response = new (class extends ApiResponseDto<T> {})(
      data,
      message,
      false,
      statusCode
    );
    return res.status(response.statusCode).json(response);
  }
}

export abstract class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = "Success",
    statusCode = 200
  ) {
    super(data, message, true, statusCode);
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = "Success"
  ): Response {
    const response = new (class extends PaginatedResponseDto<T> {})(
      data,
      total,
      page,
      limit,
      message,
      200
    );
    return res.status(response.statusCode).json(response);
  }
}
