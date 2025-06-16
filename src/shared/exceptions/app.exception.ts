import { HttpStatusCode } from 'axios';

export class AppException extends Error {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly title: string;
  public readonly data?: string;

  constructor(
    data: string,
    message: string = 'Atenção',
    statusCode: number = HttpStatusCode.BadRequest,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  getStatus(): number {
    return this.statusCode;
  }
}
