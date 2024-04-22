import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheModule } from '../../app-cache/app-cache.module';
import { UserDetailsController } from '../controllers/userDetails.controller';
import { UserDetailsEntity } from '../entities/user/userDetails.entity';
import { JwtService } from '../services/jwt/jwt.service';
import { UserDetailsService } from '../services/userDetails/userDetails.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDetailsEntity], 'db1'),
    TypeOrmModule.forFeature([UserDetailsEntity], 'db2'),
    UserModule,
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [UserDetailsController],
  providers: [UserDetailsService, JwtService],
})
export class UserDetailsModule {}
