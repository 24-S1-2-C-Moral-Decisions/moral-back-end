import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe, BadRequestException, HttpStatus } from '@nestjs/common';
import "reflect-metadata"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      const msg = Object.values(errors[0].constraints)[0];
      return new BadRequestException({
         msg: msg,
         status: HttpStatus.BAD_REQUEST
      })
    }
  }));

  process.on('warning', (warning) => {
    console.warn('Warning received:', warning);
    if (warning.name === 'MemoryWarning') {
      const memoryUsage = process.memoryUsage();
      console.log('Memory usage:', memoryUsage);
      console.log('Memory usage is high, gc...');
      if (global.gc) {
        global.gc();
        console.log('Manually triggered garbage collection');
      } else {
        console.warn('Garbage collection is not exposed');
      }
    }
  });

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

  app.enableCors();
  await app.listen(process.env.PORT, () => {
    // console.log(`Server running on http://localhost:${process.env.PORT}`);
    Logger.log('Server running on http://localhost:' + process.env.PORT, 'Bootstrap');
  });
}
bootstrap();
