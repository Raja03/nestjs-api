import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheModule } from '../../app-cache/app-cache.module';
import { UserController } from '../controllers/user.controller';
import { UserEntity } from '../entities/user/user.entity';
import { AuthService } from '../services/auth/auth.service';
import { JwtStrategy } from '../services/auth/strategies/jwt/jwt.strategy';
import { JwtService } from '../services/jwt/jwt.service';
import { PasswordService } from '../services/password/password.service';
import { UserService } from '../services/user/user.service';
import { UserDbConnModule } from './userDbConn.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], 'db1'),
    TypeOrmModule.forFeature([UserEntity], 'db2'),
    UserDbConnModule,
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [UserController],
  providers: [
    AuthService,
    UserService,
    PasswordService,
    JwtService,
    JwtStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
