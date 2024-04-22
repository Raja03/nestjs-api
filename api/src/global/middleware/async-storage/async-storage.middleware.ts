import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'node:crypto';
import { ASYNC_STORAGE } from '../../constants';

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  use(req: any, res: any, next: () => void) {
    const traceId = req.headers['x-request-id'] || randomUUID();
    const store = new Map();
    store.set('traceId', traceId);
    const authorization = req.headers['authorization'];
    store.set('token', authorization ? authorization.split(' ')[1] : '');
    this.asyncStorage.run(store, () => {
      next();
    });
  }
}
