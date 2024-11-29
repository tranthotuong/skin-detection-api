import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SportModule } from './sport/sport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // Makes config available globally
  }), AuthModule, SportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
