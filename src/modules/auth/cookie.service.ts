import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor() {}

  // WARNING (!) The passthrough option must be TRUE in the @Res() nest.js decorator before use
  // @Res({ passthrough: true }) res: Response,

  setCookieRefreshToken(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken);
  }

  clearCookieRefreshToken(res: Response) {
    res.clearCookie('refreshToken');
  }
}
