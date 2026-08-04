import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtUserGuard } from '../auth/guards/jwtUser.guard';
import { UserService } from './user.service';
import type { IRequestUser } from '../auth/types/requestUser.type';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@ApiCookieAuth('accessToken')
@Controller('users')
@UseGuards(JwtUserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      example: {
        data: [
          {
            id: 'clxuser',
            email: 'user@example.com',
            name: 'John Doe',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers() {
    return await this.userService.getAllUser();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    schema: {
      example: {
        data: {
          id: 'clxuser',
          email: 'user@example.com',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: IRequestUser) {
    const { data } = await this.userService.getProfile(req.user.email);
    return {
      data: {
        id: data?.id,
        email: data?.email,
        name: data?.name,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({ name: 'id', description: 'User id', example: 'clxuser' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        data: {
          id: 'clxuser',
          email: 'user@example.com',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteById(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
}
