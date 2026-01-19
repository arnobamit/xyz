import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!auth) throw new UnauthorizedException('Missing Authorization header');
    const parts = (auth as string).split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException('Invalid Authorization header');
    const token = parts[1];
    
    let payload: any;
    try {

      payload = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
      req.user = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = req.user;
    if (user && user.type === 'admin') {
      return true;
    }

    throw new UnauthorizedException('Access denied. Admin role required.');
  }
}