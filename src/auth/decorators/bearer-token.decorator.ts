import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];
    return getToken(bearer);
  },
);
const getToken = (bearer: string) => {
  if (!bearer) return;
  return bearer.split(' ')[1];
};
