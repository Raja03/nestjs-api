import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLoggerService } from './logger/services/app-logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
    Required to be executed before async storage middleware
    and not loose context on POST requests
   */
  app.use(json());

  app.use(helmet());

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  // API docs
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription(
      `<a
         target="_blank"
         href="https://github.com/raja03/nestjs-api"
       >https://github.com/raja03/nestjs-api</a>`,
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(`App started on http://localhost:${port}`);
}

bootstrap();
