import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './module/commom/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFillter } from './http-exception-fillter/http-exception.filter';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalFilters(new HttpExceptionFillter(configService));
  app.enableCors({
    methods: '*',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
    origin: configService.getOrThrow<string>('COR_URL'),
  });
  await app.listen(configService.get('SERVER_PORT') || 8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
