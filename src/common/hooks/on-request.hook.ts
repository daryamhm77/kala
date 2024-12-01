import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const RequestHook = (app: NestFastifyApplication) => {
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', (request, reply, done) => {
      const userAgent = request.headers['user-agent'];
      app.getHttpAdapter().getInstance().log.info(`User-Agent: ${userAgent}`);
      done();
    });
};
