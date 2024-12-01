import { CookieSerializeOptions } from '@fastify/cookie';
import { CookieExpires } from './cookie-expiration.constant';

export const CookieOptions: CookieSerializeOptions = {
  domain: process.env.FRONTEND_URL,
  secure: true,
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  expires: new Date(Date.now() + CookieExpires),
  signed: false,
};
