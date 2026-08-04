import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { CookieOptions, Response } from 'express';
import type { IRequestWithCookies } from './types/requestUser.type';

@ApiTags('Auth')
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: { message: 'User registered successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates the user and sets `accessToken` and `refreshToken` HTTP-only cookies.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, auth cookies set',
    schema: {
      example: { ok: true },
    },
  })
  @ApiResponse({ status: 400, description: 'Email or password is incorrect' })
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
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Uses the `refreshToken` HTTP-only cookie to issue a new `accessToken` cookie. No request body required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed',
    schema: {
      example: { ok: true },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token missing or invalid' })
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
  @ApiOperation({
    summary: 'Logout user',
    description: 'Clears `accessToken` and `refreshToken` cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      example: { ok: true },
    },
  })
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { ok: true };
  }
}
