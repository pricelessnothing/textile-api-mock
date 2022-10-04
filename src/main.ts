import { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const error: any = undefined;

  app.use(cookieParser());

  app.enableCors((req: Request, cb: CorsOptionsCallback): void =>
    cb(error as Error, {
      origin: req.get('origin'),
      credentials: true,
    }),
  );

  await app.listen(5000);
}
bootstrap();
