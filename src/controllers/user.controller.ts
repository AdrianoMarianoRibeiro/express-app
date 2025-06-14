import { Request, Response } from "express";
import { injectable } from "tsyringe";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from "../decorators/controller.decorator";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import {
  ApiResponseDto,
  PaginatedResponseDto,
} from "../dto/common/api-response.dto";

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
        return new PaginatedResponseDto(
          result.users,
          result.total,
          result.page,
          result.limit,
          "Users retrieved successfully"
        );
      }
      // All users
      const users = await this.userService.findAll();
      return new ApiResponseDto(users, "Users retrieved successfully");
    } catch (error) {
      res.status(500);
      return new ApiResponseDto(null, "Failed to retrieve users", false);
    }
  }

  @Get("/:id")
  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400);
        return new ApiResponseDto(null, "Invalid user ID", false);
      }

      const user = await this.userService.findById(id);

      if (!user) {
        res.status(404);
        return new ApiResponseDto(null, "User not found", false);
      }

      return new ApiResponseDto(user, "User retrieved successfully");
    } catch (error) {
      res.status(500);
      return new ApiResponseDto(null, "Failed to retrieve user", false);
    }
  }

  @Post()
  async create(req: Request, res: Response) {
    try {
      const createUserDto: CreateUserDto = req.body;

      const user = await this.userService.create(createUserDto);
      res.status(201);
      return new ApiResponseDto(user, "User created successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      res.status(400);
      return new ApiResponseDto(null, message, false);
    }
  }

  @Put("/:id")
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400);
        return new ApiResponseDto(null, "Invalid user ID", false);
      }

      const updateUserDto: UpdateUserDto = req.body;

      const user = await this.userService.update(id, updateUserDto);

      if (!user) {
        res.status(404);
        return new ApiResponseDto(null, "User not found", false);
      }

      return new ApiResponseDto(user, "User updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      res.status(400);
      return new ApiResponseDto(null, message, false);
    }
  }

  @Delete("/:id")
  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400);
        return new ApiResponseDto(null, "Invalid user ID", false);
      }

      const deleted = await this.userService.delete(id);

      if (!deleted) {
        res.status(404);
        return new ApiResponseDto(null, "User not found", false);
      }

      return new ApiResponseDto(null, "User deleted successfully");
    } catch (error) {
      res.status(500);
      return new ApiResponseDto(null, "Failed to delete user", false);
    }
  }
}
