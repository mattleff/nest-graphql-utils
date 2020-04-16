import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  createParamDecorator,
  InternalServerErrorException,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import {
  DataLoaderInterceptor,
  LOADER_ACCESSOR_CONTEXT_KEY,
} from '../interceptors/dataLoader.interceptor';
import { BatchLoader } from '../utilities/batchLoader';

interface LoaderClass {
  new (...args: any[]): BatchLoader<any, any>;
}

/**
 * Use the loader accessor to obtain a BatchLoader instance based on type.
 * For more info on loader accessor, see dataLoader.interceptor.ts
 */
export const Loader = createParamDecorator(async (data: LoaderClass, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext();
  const interceptor = ctx[LOADER_ACCESSOR_CONTEXT_KEY];
  if (!interceptor) {
    throw new InternalServerErrorException(`
            You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
          `);
  }

  return await interceptor.getLoader(data.name);
});
