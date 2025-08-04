import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FacebookGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.query['hub.verify_token'];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Missing page access token');
    }

    const expectedToken = process.env.PAGE_ACCESS_TOKEN;

    if (!expectedToken) {
      throw new Error('PAGE_ACCESS_TOKEN environment variable is not set');
    }

    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid page access token');
    }

    return true;
  }
}
