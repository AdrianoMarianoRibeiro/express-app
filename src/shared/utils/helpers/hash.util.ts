import { createHash } from 'crypto';

export abstract class HashUtil {
  static async make(value: any, hashType: string = 'sha256'): Promise<string> {
    return createHash(hashType).update(value).digest('hex');
  }
}
