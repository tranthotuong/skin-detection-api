import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SportModule } from './sport/sport.module';
import { ScanHistoryController } from './scan-history/scan-history.controller';
import { ScanHistoryService } from './scan-history/scan-history.service';
import { ScanHistoryModule } from './scan-history/scan-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // Makes config available globally
  }), AuthModule, SportModule, ScanHistoryModule],
  controllers: [AppController, ScanHistoryController],
  providers: [AppService, ScanHistoryService],
})
export class AppModule { }
