import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SportController],
  providers: [SportService, PrismaService]
})
export class SportModule {}
