import { User, Otp } from '@prisma/client';

export interface IUserEntity extends User {
  otp?: Otp;
}
