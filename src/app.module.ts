import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { UsersController } from './module/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { AuthMiddleware } from './module/auth/auth.middleware';
import { UsersService } from './module/users/users.service';
import { CommomModule } from './module/commom/commom.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        username: configService.get<string>('DB_USERNAME'),
        port: configService.get<number>('DB_PORT'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    UsersModule,
    AuthModule,
    CommomModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.PATCH },
        { path: 'users', method: RequestMethod.POST },
        'auth',
      )
      .forRoutes('*');
  }
}
