import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class RandomService {
  // this function generates code for the OTP service
  async generateDigitString(length: number): Promise<string> {
    const digits = Array.from({ length }, () => randomInt(9));
    return digits.join('');
  }
}
