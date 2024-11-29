import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
