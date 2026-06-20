import * as jose from 'jose';
import { env } from '../../config/env';
import type { IAuthTokenService } from '../../domain/ports/services/IAuthTokenService';
import { AuthenticationError } from '../../domain/errors';

// ============================================================
// JoseAuthTokenService
// Concrete adapter implementing JWT operations using jose
// ============================================================

export class JoseAuthTokenService implements IAuthTokenService {
  private readonly accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
  private readonly refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

  async generateAccessToken(userId: string, role: string): Promise<string> {
    return new jose.SignJWT({ userId, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_ACCESS_EXPIRY)
      .sign(this.accessSecret);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return new jose.SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_REFRESH_EXPIRY)
      .sign(this.refreshSecret);
  }

  async verifyAccessToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      const { payload } = await jose.jwtVerify(token, this.accessSecret);
      if (!payload.userId || !payload.role) {
        throw new AuthenticationError('Invalid token payload');
      }
      return {
        userId: payload.userId as string,
        role: payload.role as string,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      throw new AuthenticationError('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    try {
      const { payload } = await jose.jwtVerify(token, this.refreshSecret);
      if (!payload.userId) {
        throw new AuthenticationError('Invalid token payload');
      }
      return {
        userId: payload.userId as string,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      throw new AuthenticationError('Invalid refresh token');
    }
  }
}
