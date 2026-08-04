import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { IJwtPayload } from '../types/jwtPayload.type';
import type { IRequestUser } from '../types/requestUser.type';

@Injectable()
export class JwtUserGuard extends AuthGuard('jwt-user') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    if (!ok) {
      throw new UnauthorizedException();
    }

    const req: IRequestUser = context.switchToHttp().getRequest();
    const user: IJwtPayload = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
