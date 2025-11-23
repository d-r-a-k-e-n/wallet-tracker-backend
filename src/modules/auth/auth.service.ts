import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
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

  private generateToken(payload: jwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  getAllUsers() {
    try {
      return this.userService.getAllUser();
    } catch {
      return { message: 'Something went wrong' };
    }
  }

  async register(body: RegisterDto) {
    try {
      const heshPassword = await bcrypt.hash(body.password, 10);
      await this.userService.createUser({
        email: body.email,
        password: heshPassword,
        name: body.name,
      });

      return { message: 'User registered successfully' };
    } catch {
      return { message: 'Something went wrong' };
    }
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) return { message: 'Email or password is incorrect' };

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) return { message: 'Email or password is incorrect' };

    const payload: jwtPayload = { id: user.id, name: user.name };
    const tokens = this.generateToken(payload);

    return tokens;
  }
}
