import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { JwtUserGuard } from 'src/modules/auth/guards/jwt-user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtUserGuard)
  @Get()
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
