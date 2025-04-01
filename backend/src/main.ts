import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors('http://localhost:5173/');
  await app.listen(process.env.Port ?? 3000);
}
bootstrap();
