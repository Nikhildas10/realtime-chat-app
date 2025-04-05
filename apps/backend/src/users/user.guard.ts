import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { credentials } from 'src/config/credentials';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = jwt.verify(
        token,
        credentials.accessTokenSecret as string,
      );

      if (typeof decoded === 'object' && 'id' in decoded) {
        request.user = decoded;
        return true;
      }

      throw new UnauthorizedException('Invalid token payload');
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token', error);
    }
  }
}
