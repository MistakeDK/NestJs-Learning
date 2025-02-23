import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './module/commom/response.interceptor';
import { HttpExceptionFillterFilter } from './http-exception-fillter/http-exception-fillter.filter';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFillterFilter());
  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('SERVER_PORT') || 8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
