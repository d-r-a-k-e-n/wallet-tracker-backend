import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUser() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
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

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }
}
