import { Response } from "express";
export declare abstract class ApiResponseDto<T> {
    data?: T;
    message: string;
    success: boolean;
    statusCode: number;
    timestamp: Date;
    constructor(data?: T, message?: string, success?: boolean, statusCode?: number);
    static success<T>(res: Response, data?: T, message?: string, statusCode?: number): Response;
    static warning<T>(res: Response, message?: string, statusCode?: number, data?: T): Response;
    static error<T>(res: Response, message?: string, statusCode?: number, data?: T): Response;
}
export declare abstract class PaginatedResponseDto<T> extends ApiResponseDto<T[]> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    constructor(data: T[], total: number, page: number, limit: number, message?: string, statusCode?: number);
    static paginated<T>(res: Response, data: T[], total: number, page: number, limit: number, message?: string): Response;
}
