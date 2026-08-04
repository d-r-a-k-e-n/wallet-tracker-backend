import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(email: string) {
    try {
      return {
        data: await this.prisma.user.findUnique({
          where: { email },
        }),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUser() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          updatedAt: true,
        },
      });

      return {
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createUser({ email, password, name }: RegisterDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteById(id: string) {
    try {
      return {
        data: await this.prisma.user.delete({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
          },
        }),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
