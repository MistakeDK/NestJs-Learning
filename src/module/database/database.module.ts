import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        port: configService.getOrThrow<number>('DB_PORT'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow<boolean>('DB_SYNC'),
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerivce: ConfigService) => ({
        uri: configSerivce.getOrThrow<string>('DB_MONGOOSE_URI'),
        dbName: configSerivce.getOrThrow<string>('DB_NAME'),
      }),
    }),
  ],
})
export class DatabaseModule {}
