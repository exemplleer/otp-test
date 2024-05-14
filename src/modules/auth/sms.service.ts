import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}
  private readonly exolveSmsApi = 'https://api.exolve.ru/messaging/v1/SendSMS';

  async sendSmsWithCodeViaExolve(to: string, code: string): Promise<any> {
    // https://docs.exolve.ru/docs/ru/api-reference/sms-api/sending-sms/
    try {
      const requestData = {
        number: process.env.EXOLVE_SMS_ALPHA_NAME,
        destination: to,
        text: `Код для подтверждения: ${code}`,
      };
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${process.env.EXOLVE_API_KEY}`,
        },
      };
      await firstValueFrom(
        this.httpService.post(this.exolveSmsApi, requestData, config),
      );
    } catch (err) {
      Logger.error(`Send SMS error: ${err.message}`, SmsService.name);
    }
  }
}
