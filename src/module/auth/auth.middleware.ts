import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['Authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async use(req: Request, res: Response, next: () => void) {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      if (payload) {
        next();
      }
    } catch {
      throw new UnauthorizedException();
    }
  }
}
