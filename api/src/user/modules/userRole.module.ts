import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheModule } from '../../app-cache/app-cache.module';
import { UserRoleController } from '../controllers/userRole.controller';
import { UserRoleEntity } from '../entities/user/userRole.entity';
import { JwtService } from '../services/jwt/jwt.service';
import { UserRoleService } from '../services/userRole/userRole.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleEntity], 'db1'),
    TypeOrmModule.forFeature([UserRoleEntity], 'db2'),
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService, JwtService],
})
export class UserRoleModule {}
