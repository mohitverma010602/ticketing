import bcrypt from "bcrypt";

export class Password {
  static async toHash(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return bcrypt.compare(suppliedPassword, storedPassword);
  }
}
