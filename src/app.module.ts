import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { CommomModule } from './module/commom/commom.module';
import { RoleModule } from './module/role/role.module';
import { PermissionModule } from './module/permission/permission.module';
import { OpenaiModule } from './module/openai/openai.module';
import { ChatGatewayModule } from './module/chat-gateway/chat-gateway.module';
import { DatabaseModule } from './module/database/database.module';
import { ChatStoreModule } from './module/chat-store/ChatStore.module';
import { CacheAppModule } from './module/cache/cacheApp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    CacheAppModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    ChatStoreModule,
    OpenaiModule,
    CommomModule,
    ChatGatewayModule,
  ],
})
export class AppModule {}
