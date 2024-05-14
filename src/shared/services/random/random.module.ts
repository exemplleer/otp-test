import { Module } from '@nestjs/common';
import { RandomService } from './random.service';

@Module({
  exports: [RandomService],
  providers: [RandomService],
})
export class RandomModule {}
