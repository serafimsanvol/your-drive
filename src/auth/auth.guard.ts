import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  extractTokenFromHeader(authHeader: string | undefined): string | undefined {
    if (typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1]; // Return the token part
      }
    }
    return undefined; // No valid token found
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: Record<string, unknown>;
      headers: Record<string, string | undefined>;
    }>();
    const authHeader = request.headers?.authorization;
    const token = this.extractTokenFromHeader(authHeader);

    if (!token) return false; // No token provided

    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token);
      request.user = payload; // Attach user info to the request
      return true; // Token is valid
    } catch (error) {
      console.error('Token verification failed:', error);
      return false; // Invalid token
    }
  }
}
