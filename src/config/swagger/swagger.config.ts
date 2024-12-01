import { SwaggerModule } from '@nestjs/swagger';
import { fastifyBasicAuth } from '@fastify/basic-auth';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerDocument } from 'src/common/constants/swagger-document.constant';
import { FastifyReply, FastifyRequest } from 'fastify';
import { swaggerOptions } from 'src/common/constants/swagger-options.constant';

export const SwaggerConfig = async (
  app: NestFastifyApplication,
): Promise<void> => {
  const SWAGGER_ENVS = ['production'];
  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    const validate = async (
      username: string,
      password: string,
      req: FastifyRequest,
      reply: FastifyReply,
    ) => {
      const user = process.env.SWAGGER_USER;
      const pass = process.env.SWAGGER_PASSWORD;
      if (username !== user || password !== pass) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }
    };

    const document = SwaggerModule.createDocument(app, SwaggerDocument);
    SwaggerModule.setup('/api-docs', app, document, swaggerOptions);
    await app.register(fastifyBasicAuth, {
      validate,
      authenticate: { realm: 'Westeros' },
    });

    app
      .getHttpAdapter()
      .getInstance()
      .addHook('onRequest', (request, reply, done) => {
        if (
          ['/api-docs', '/api-docs-json', '/api-docs/'].includes(
            request.raw.url,
          )
        ) {
          app.getHttpAdapter().getInstance().basicAuth(request, reply, done);
        } else {
          done();
        }
      });
  } else {
    const swaggerDocument = SwaggerModule.createDocument(app, SwaggerDocument);
    SwaggerModule.setup('/api-docs', app, swaggerDocument, swaggerOptions);
  }
};
