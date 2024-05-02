import { User, Otp } from '@prisma/client';

export interface IOtpEntity extends Otp {}
export interface IUserEntity extends User {
  otp?: IOtpEntity;
}
