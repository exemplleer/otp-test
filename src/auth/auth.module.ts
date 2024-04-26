import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RandomModule } from 'src/random/random.module';

@Module({
  imports: [RandomModule],
  exports: [RandomModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
