import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheModule } from '../../app-cache/app-cache.module';
import { UserDbConnEntity } from '../entities/master/userDbConn.entity';
import { UserDbConnService } from '../services/userDbConn/userDbConn.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDbConnEntity], 'db0'),
    ConfigModule,
    AppCacheModule,
  ],
  providers: [UserDbConnService],
  exports: [UserDbConnService],
})
export class UserDbConnModule {}
