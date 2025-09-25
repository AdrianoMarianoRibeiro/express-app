"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = exports.ApiResponseDto = void 0;
class ApiResponseDto {
    constructor(data, message = "Success", success = true, statusCode = 200) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.statusCode = statusCode;
        this.timestamp = new Date();
    }
    static success(res, data, message = "Success", statusCode = 200) {
        const response = new (class extends ApiResponseDto {
        })(data, message, true, statusCode);
        return res.status(response.statusCode).json(response);
    }
    static warning(res, message = "Attention", statusCode = 400, data) {
        const response = new (class extends ApiResponseDto {
        })(data, message, false, statusCode);
        return res.status(response.statusCode).json(response);
    }
    static error(res, message = "Error", statusCode = 400, data) {
        const response = new (class extends ApiResponseDto {
        })(data, message, false, statusCode);
        return res.status(response.statusCode).json(response);
    }
}
exports.ApiResponseDto = ApiResponseDto;
class PaginatedResponseDto extends ApiResponseDto {
    constructor(data, total, page, limit, message = "Success", statusCode = 200) {
        super(data, message, true, statusCode);
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
    }
    static paginated(res, data, total, page, limit, message = "Success") {
        const response = new (class extends PaginatedResponseDto {
        })(data, total, page, limit, message, 200);
        return res.status(response.statusCode).json(response);
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
