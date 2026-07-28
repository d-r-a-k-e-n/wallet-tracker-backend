import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtUserStrategy } from 'src/modules/auth/strategis/jwt-user.strategi';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: +configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_LIFETIME',
          ),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtUserStrategy, PrismaService],
})
export class AuthModule {}
