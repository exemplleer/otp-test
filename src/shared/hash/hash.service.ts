import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  saltDefault = 8;

  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.saltDefault);
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(data, hashedData);
  }
}
