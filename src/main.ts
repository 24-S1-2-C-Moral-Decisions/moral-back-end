import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
      const config = new DocumentBuilder()
      .setTitle('Moral Decisions API')
      .setDescription('The Moral Decisions API description')
      .setVersion('0.0.1')
      .addTag('default')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(5000, () => {
    // console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
    Logger.log('Server running on http://localhost:' + process.env.SERVER_PORT, 'Bootstrap');
  });
}
bootstrap();
