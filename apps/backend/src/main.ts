import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  console.log('booting');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'warn', 'verbose'],
  });
  const logger = new Logger('Bootstrap');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    /([a-zA-Z0-9-]+)*kir-dev\.vercel\.app$/, // Correct regex usage
  ];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });
  const config = new DocumentBuilder().setTitle('SCHBody WEB').setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.BACKEND_PORT || 3300);
}
bootstrap();
