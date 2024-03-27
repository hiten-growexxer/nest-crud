import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CONSTANTS } from '../utils/constants';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.user.role === CONSTANTS.ROLES.ADMIN;
  }
}
