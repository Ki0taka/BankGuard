import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Global Validation
  // This automatically validates incoming requests based on DTO classes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that don't have decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // 2. Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Sanctions Intelligence Management System')
    .setDescription('The API documentation for SIMS')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT support to Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
