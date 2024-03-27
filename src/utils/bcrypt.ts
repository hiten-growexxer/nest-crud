import * as bcrypt from 'bcrypt';
import { CONSTANTS } from './constants';
export class Bcrypt {
  static async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(CONSTANTS.SALT_LENGTH);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
