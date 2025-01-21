import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard is used to allow anonymous users to access a route,
 * but still have the user object in the request object.
 */
@Injectable()
export class AnonGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, _status?: any): TUser {
    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
