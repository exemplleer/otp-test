import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor() {}

  // WARNING (!) The passthrough option must be TRUE in the @Res() nest.js decorator before use
  // @Res({ passthrough: true }) res: Response,

  setRefreshToken(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken);
  }

  clearRefreshToken(res: Response) {
    res.clearCookie('refreshToken');
  }
}
