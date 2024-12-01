import * as queryString from 'querystring';

export function createSMSParams(
  username: string,
  password: string,
  receptor: string,
  code: string,
  bodyId: number,
) {
  return queryString.stringify({
    username,
    password,
    text: code,
    to: receptor,
    bodyId,
  });
}
