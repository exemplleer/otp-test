import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { toMs } from 'ms-typescript';

@Injectable()
export class CookieService {
  constructor() {}

  // WARNING (!) The passthrough option must be TRUE in the @Res() nest.js decorator before use
  // @Res({ passthrough: true }) res: Response,

  setRefreshToken(res: Response, refreshToken: string) {
    const maxAge = toMs(process.env.REFRESH_TOKEN_EXPIRATION);
    res.cookie('refreshToken', refreshToken, { maxAge });
  }

  clearRefreshToken(res: Response) {
    res.clearCookie('refreshToken');
  }
}
