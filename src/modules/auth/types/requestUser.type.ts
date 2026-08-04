import type { Request } from 'express';
import type { IAuthCookies } from './authCookies.type';
import type { IJwtPayload } from './jwtPayload.type';

export interface IRequestWithCookies extends Request {
  cookies: IAuthCookies;
}

export interface IRequestUser extends IRequestWithCookies {
  user: IJwtPayload;
}
