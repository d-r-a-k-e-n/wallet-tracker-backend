import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { CookieOptions, Response } from 'express';
import type { IRequestWithCookies } from './types/requestUser.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private isProd() {
    return process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  }

  private cookieOptions(maxAgeSeconds: number): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProd(),
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    };
  }

  private clearAuthCookies(res: Response) {
    const clearOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProd(),
      path: '/',
    };
    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    res.cookie(
      'accessToken',
      accessToken,
      this.cookieOptions(+process.env.JWT_ACCESS_TOKEN_LIFETIME!),
    );
    res.cookie(
      'refreshToken',
      refreshToken,
      this.cookieOptions(+process.env.JWT_REFRESH_TOKEN_LIFETIME!),
    );

    return { ok: true };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: IRequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    res.cookie(
      'accessToken',
      accessToken,
      this.cookieOptions(+process.env.JWT_ACCESS_TOKEN_LIFETIME!),
    );

    return { ok: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { ok: true };
  }
}
