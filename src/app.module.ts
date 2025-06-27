import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/databaseConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true, // Makes the configuration available globally
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
