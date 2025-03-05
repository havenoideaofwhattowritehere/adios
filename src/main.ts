import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { SystemService } from './core/system/system.service';
import { AppLogger } from './shared/logging/logger.service';
import { ResponseInterceptor } from './shared/common/utils/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const system = app.get<SystemService>(SystemService);
  const logger = app.get<AppLogger>(AppLogger);

  logger.setContext('Bootstrap');

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    app.close().then(() => process.exit(1));
  });

  app.useLogger(logger);
  app.useGlobalInterceptors(new ResponseInterceptor(logger));

  app.enableCors({
    origin: [
      configService.get<string>('CORS_ORIGIN'),
      configService.get<string>('CORS_ORIGIN_LOCALHOST'),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Sport CRM Swagger')
    .setDescription('Sport CRM API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'current_club_id',
        in: 'header',
      },
      'club-id-header',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'lang',
        in: 'header',
      },
      'language',
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('app.port');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );
  await app.listen(port, () => {
    logger.verbose(`Server is running on port ${port}!`);
    if (system.canRunInThisEnvironment()) {
      logger.logz_io(`Server is started and  running on port ${port}!`);
    }
  });
}
bootstrap();
