import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
interface RequestCustom extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async use(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization'];
      // const token = req.headers['authorization'].split(' ')[1];
      if (!token) {
        throw new ForbiddenException();
      }
      const { email } = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (!email) {
        throw new ForbiddenException();
      }
      const user = await this.repo.findOne({ where: { email } });
      if (!user) {
        throw new ForbiddenException();
      }
      req.user = user;
      next();
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
