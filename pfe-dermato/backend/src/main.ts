// backend/src/main.ts
import { NestFactory, Reflector }                     from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder }             from '@nestjs/swagger';
import { AppModule }                                  from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:           true,
      forbidNonWhitelisted: true,
      transform:           true,
    }),
  );

  // ✅ Serializer (pour @Exclude sur passwordHash)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // ✅ CORS pour React Native
  app.enableCors({ origin: '*' });

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('DermaScan API')
    .setDescription('Documentation de API dermatologique')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type:         'http',
        scheme:       'bearer',
        bearerFormat: 'JWT',
        description:  'Collez votre accessToken ici',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend demarre sur http://localhost:${port}`);
  console.log(`📘 Swagger disponible sur http://localhost:${port}/api`);
}
bootstrap();