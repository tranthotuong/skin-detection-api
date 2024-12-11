import { Module } from '@nestjs/common';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Module({
    controllers: [DiagnosisController],
    providers: [DiagnosisService, CloudinaryService,  PrismaService]
  })
export class DiagnosisModule {}
