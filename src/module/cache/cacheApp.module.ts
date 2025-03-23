import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheAppService } from './cacheApp.service';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [createKeyv(configService.getOrThrow<string>('REDIS_URL'))],
      }),
    }),
  ],
  providers: [CacheAppService],
  exports: [CacheAppService],
})
export class CacheAppModule {}
