import * as argon2 from 'argon2';

export class Hash {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async compare(hashedPassword: string, password: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
}

export default new Hash();
