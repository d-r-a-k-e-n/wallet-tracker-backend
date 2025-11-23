import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUser() {
    return this.prisma.user.findMany();
  }

  async createUser({ email, password, name }: RegisterDto) {
    await this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
