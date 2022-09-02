import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// Import firebase-admin
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const databaseConfig = {
    adminConfig: {
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    } as ServiceAccount,
    databaseUrl: configService.get<string>('DATABASE_URL'),
  };
  console.log(databaseConfig);
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(databaseConfig.adminConfig),
    databaseURL: databaseConfig.databaseUrl,
  });
  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('Swagger for block sign app')
    .setVersion('1.0')
    .addTag('Swagger')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8083);
}
bootstrap();
