import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Fingerprint = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const fingerprint = request.headers['user-agent'];
  return fingerprint;
});
