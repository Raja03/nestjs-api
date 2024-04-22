import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from './constants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ASYNC_STORAGE,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [ASYNC_STORAGE],
})
export class GlobalModule {}
