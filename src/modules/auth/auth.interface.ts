import { RefreshSession } from '@prisma/client';

export interface IUserPayload {
  uuid: string;
  phone: string;
}
export interface ITokenData {
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshSession extends RefreshSession {}
