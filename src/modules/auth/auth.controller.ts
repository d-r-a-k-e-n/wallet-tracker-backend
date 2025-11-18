import { Controller, Get } from '@nestjs/common';
import { AuthServise } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServise) {}

  @Get()
  getHello(): string {
    return this.authService.register();
  }
}
