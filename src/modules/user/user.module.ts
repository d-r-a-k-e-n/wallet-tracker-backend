import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from 'src/modules/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
