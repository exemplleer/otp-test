import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class RandomService {
  // this function generates a 6-digit code for the OTP service
  async generateSixDigitCode(): Promise<string> {
    const codeArray = Array.from({ length: 6 }, () => randomInt(9));
    const code = codeArray.join('');
    return code;
  }
}
