import argon2 from 'argon2';
import type { IPasswordService } from '../../domain/ports/services/IPasswordService';

// ============================================================
// Argon2PasswordService
// Concrete adapter implementing password hashing using argon2
// ============================================================

export class Argon2PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch {
      return false;
    }
  }
}
