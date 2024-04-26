import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class RandomService {
  async generateOtpCode(): Promise<string> {
    const codeArray = Array.from({ length: 6 }, () => randomInt(9));
    const code = codeArray.join('');
    return code;
  }
}
