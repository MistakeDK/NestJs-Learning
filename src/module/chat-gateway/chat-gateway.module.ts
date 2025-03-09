import { Module } from '@nestjs/common';
import { ChatGateWay } from './chatGateway.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [ChatGateWay],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('SECRET_KEY'),
        };
      },
    }),
  ],
})
export class ChatGatewayModule {}
