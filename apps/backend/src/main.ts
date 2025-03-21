import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', RegExp('([a-zA-Z0-9-]+)*kir-dev.vercel.app/')],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder().setTitle('SCHBody WEB').setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.BACKEND_PORT || 3300);
}
bootstrap();
