import { Module } from '@nestjs/common';
import { ScanHistoryController } from './scan-history.controller';
import { ScanHistoryService } from './scan-history.service';
import { PrismaService } from '../prisma/prisma.service';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
    controllers: [ScanHistoryController],
    providers: [ScanHistoryService, DiagnosisService, CloudinaryService, PrismaService]
  })
export class ScanHistoryModule {}
