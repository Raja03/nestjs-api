import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppCacheModule } from './app-cache/app-cache.module';
import { GlobalModule } from './global/global.module';
import { AsyncStorageMiddleware } from './global/middleware/async-storage/async-storage.middleware';
import { LoggerModule } from './logger/logger.module';
import { getConfig } from './services/app-config/configuration';
import { UserModule } from './user/modules/user.module';
import { UserDetailsModule } from './user/modules/userDetails.module';
import { UserRoleModule } from './user/modules/userRole.module';
import { UserTypeModule } from './user/modules/userType.module';

import { DbModule } from './db/db.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    AppCacheModule,
    UserModule,
    UserDetailsModule,
    UserTypeModule,
    UserRoleModule,
    ConfigModule,
    LoggerModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
