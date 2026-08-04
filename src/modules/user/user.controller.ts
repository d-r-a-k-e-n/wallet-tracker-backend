import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtUserGuard } from '../auth/guards/jwtUser.guard';
import { UserService } from './user.service';
import type { IRequestUser } from '../auth/types/requestUser.type';

@Controller('users')
@UseGuards(JwtUserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUser();
  }

  @Get('me')
  async findById(@Req() req: IRequestUser) {
    return await this.userService.findById(req.user.id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
}
