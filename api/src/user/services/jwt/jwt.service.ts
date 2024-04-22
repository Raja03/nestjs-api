import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: string | Buffer | object): string {
    return sign(payload, this.configService.get('jwtSecret') as string, {
      expiresIn: '2h',
    });
  }

  parse(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }
}
