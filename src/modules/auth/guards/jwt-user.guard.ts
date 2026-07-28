import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtUserGuard extends AuthGuard('jwt-user') {
  constructor(private readonly userServise: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    if (!ok) {
      throw new UnauthorizedException();
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const userInfo = await this.userServise.findById(user.id);

    if (!userInfo) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
