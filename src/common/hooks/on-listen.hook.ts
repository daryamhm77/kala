import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const ListenHook = (app: NestFastifyApplication, PORT: number) => {
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onListen', (done) => {
      app
        .getHttpAdapter()
        .getInstance()
        .log.info(`Swagger Doc: http://127.0.0.1:${PORT}/api-docs`);
      done();
    });
};
