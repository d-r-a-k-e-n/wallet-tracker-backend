import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { jwtPayload } from 'src/modules/auth/types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private async generateTokens(payload: jwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_REFRESH_TOKEN_LIFETIME!,
      secret: process.env.JWT_SECRET_REFRESH,
    });
    return { accessToken, refreshToken };
  }

  getAllUsers() {
    return this.userService.getAllUser();
  }

  async register(body: RegisterDto) {
    const heshPassword = await bcrypt.hash(body.password, 10);
    await this.userService.createUser({
      email: body.email,
      password: heshPassword,
      name: body.name,
    });

    return { message: 'User registered successfully' };
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) throw new BadRequestException('Email or password is incorrect');

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid)
      throw new BadRequestException('Email or password is incorrect');

    const payload: jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return this.generateTokens(payload);
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_REFRESH,
      });

      return this.generateTokens({
        id: payload.id,
        name: payload.name,
        email: payload.email,
      });
    } catch (e) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
