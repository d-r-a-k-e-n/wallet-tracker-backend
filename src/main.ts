import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Request, Response } from 'express';

const expressApp = express();
let nestReady: Promise<void> | null = null;

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://wallet-tracker-frontend.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

function applyCors(req: Request, res: Response) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
  );
}

expressApp.use((req, res, next) => {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

async function createNestApp() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cookie',
    ],
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

if (!process.env.VERCEL) {
  bootstrap();
}

export default async function handler(req: Request, res: Response) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  await ensureNestApp();
  return expressApp(req, res);
}
