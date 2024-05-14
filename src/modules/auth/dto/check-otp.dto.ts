import { IsString, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class CheckOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  code: string;
}
