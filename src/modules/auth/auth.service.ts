import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  getAllUsers() {
    try {
      return this.prisma.user.findMany();
    } catch {
      return { message: 'Something went wrong' };
    }
  }

  async register(RegisterDto: RegisterDto) {
    try {
      const pas = await bcrypt.hash(RegisterDto.password, 10);
      return await this.prisma.user.create({
        data: {
          email: RegisterDto.email,
          password: pas,
          name: RegisterDto.name,
        },
      });
    } catch {
      return { message: 'User with this email or password already exists' };
    }
  }
}
