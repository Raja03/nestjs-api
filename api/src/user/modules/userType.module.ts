import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '../services/jwt/jwt.service';
import { AppCacheModule } from '../../app-cache/app-cache.module';
import { UserTypeController } from '../controllers/userType.controller';
import { UserTypeEntity } from '../entities/user/userType.entity';
import { UserTypeService } from '../services/userType/userType.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeEntity], 'db1'),
    TypeOrmModule.forFeature([UserTypeEntity], 'db2'),
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [UserTypeController],
  providers: [UserTypeService, JwtService],
})
export class UserTypeModule {}
