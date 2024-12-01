import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerDocument = new DocumentBuilder()
  .setTitle('Kalalotus')
  .setDescription('Backend api for kalalotus.ir')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      description: `Enter Your Token`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    },
    'access-token',
  )
  .build();
