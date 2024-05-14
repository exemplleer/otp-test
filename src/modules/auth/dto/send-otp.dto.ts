import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;
}
