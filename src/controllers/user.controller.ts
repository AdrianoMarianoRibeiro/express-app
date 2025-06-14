import { Request, Response } from "express";
import { injectable } from "tsyringe";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from "../decorators/controller.decorator";
import {
  ApiResponseDto,
  PaginatedResponseDto,
} from "../dto/common/api-response.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("/user")
@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        // Paginated response
        const result = await this.userService.findWithPagination(page, limit);
        return PaginatedResponseDto.paginated(
          res,
          result.users,
          result.total,
          result.page,
          result.limit,
          "Users retrieved successfully"
        );
      }
      // All users
      const users = await this.userService.findAll();
      return ApiResponseDto.success(res, users, "Users retrieved successfully");
    } catch (error) {
      return ApiResponseDto.error(
        res,
        "Failed to retrieve users",
        res.statusCode
      );
    }
  }

  @Get("/:id")
  async findById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400);
        return ApiResponseDto.error(res, "Invalid user ID");
      }

      const user = await this.userService.findById(id);

      if (!user) {
        res.status(404);
        return ApiResponseDto.warning(res, "User not found");
      }

      return ApiResponseDto.success(res, user, "User retrieved successfully");
    } catch (error) {
      return ApiResponseDto.error(
        res,
        "Failed to retrieve user",
        res.statusCode
      );
    }
  }

  @Post()
  async create(req: Request, res: Response) {
    try {
      const createUserDto: CreateUserDto = req.body;

      const user = await this.userService.create(createUserDto);

      return ApiResponseDto.success(
        res,
        user,
        "User created successfully",
        res.statusCode
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      return ApiResponseDto.error(res, message, res.statusCode);
    }
  }

  @Put("/:id")
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400);
        return ApiResponseDto.warning(res, "Invalid user ID", res.statusCode);
      }

      const updateUserDto: UpdateUserDto = req.body;

      const user = await this.userService.update(id, updateUserDto);

      if (!user) {
        res.status(404);
        return ApiResponseDto.warning(res, "User not found", res.statusCode);
      }

      return ApiResponseDto.success(
        res,
        user,
        "User updated successfully",
        res.statusCode
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      res.status(400);
      return ApiResponseDto.error(res, message, res.statusCode);
    }
  }

  @Delete("/:id")
  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400);
        return ApiResponseDto.warning(res, "Invalid user ID", res.statusCode);
      }

      const deleted = await this.userService.delete(id);

      if (!deleted) {
        res.status(404);
        return ApiResponseDto.warning(res, "User not found", res.statusCode);
      }

      return ApiResponseDto.success(res, "User deleted successfully");
    } catch (error) {
      res.status(500);
      return ApiResponseDto.error(res, "Failed to delete user", res.statusCode);
    }
  }
}
