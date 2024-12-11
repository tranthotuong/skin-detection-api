import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SportModule } from './sport/sport.module';
import { ScanHistoryController } from './scan-history/scan-history.controller';
import { ScanHistoryModule } from './scan-history/scan-history.module';
import { DiagnosisController } from './diagnosis/diagnosis.controller';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { ScanHistoryService } from './scan-history/scan-history.service';
import { PrismaService } from './prisma/prisma.service';
import { DiagnosisService } from './diagnosis/diagnosis.service';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // Makes config available globally
  }), AuthModule, SportModule, ScanHistoryModule, DiagnosisModule, CloudinaryModule],
  controllers: [AppController, ScanHistoryController, DiagnosisController, CloudinaryController],
  providers: [AppService, ScanHistoryService, PrismaService, DiagnosisService, CloudinaryService],
})
export class AppModule { }
