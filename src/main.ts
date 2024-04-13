import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe, BadRequestException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      // 此处要注意，errors是一个对象数组，包含了当前所调接口里，所有验证失败的参数及错误信息。
      // 此处的处理是只返回第一个错误信息
      let msg = Object.values(errors[0].constraints)[0];
      return new BadRequestException({
         msg: msg,
         status: HttpStatus.BAD_REQUEST
      })
    }
  }));

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

  await app.listen(process.env.SERVER_PORT, () => {
    // console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
    Logger.log('Server running on http://localhost:' + process.env.SERVER_PORT, 'Bootstrap');
  });
}
bootstrap();
