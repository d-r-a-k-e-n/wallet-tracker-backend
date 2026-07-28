import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Request, Response } from 'express';

const expressApp = express();
let nestReady: Promise<void> | null = null;

function getCorsOrigins() {
  const origins = [
    'http://localhost:3000',
    'https://wallet-tracker-frontend.vercel.app',
  ];

  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  return origins;
}

async function createNestApp() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });

  await app.init();
}

function ensureNestApp() {
  if (!nestReady) {
    nestReady = createNestApp();
  }
  return nestReady;
}

async function bootstrap() {
  await ensureNestApp();
  const port = process.env.PORT ?? 3000;
  await expressApp.listen(port);
}

// Local / non-Vercel
if (!process.env.VERCEL) {
  bootstrap();
}

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  await ensureNestApp();
  return expressApp(req, res);
}
