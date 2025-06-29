import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  todo make it local setup
  app.enableCors({ origin: '*' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
