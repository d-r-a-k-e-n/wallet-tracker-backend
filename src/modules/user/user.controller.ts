import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/modules/auth/guards/jwt-user.guard';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtUserGuard)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUser();
  }

  @UseGuards(JwtUserGuard)
  @Get('me')
  async findById(@Req() req: any) {
    return await this.userService.findById(req.user.id);
  }
}
