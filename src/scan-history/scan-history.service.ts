import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScanHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new ScanHistory record.
   * @param data - The initial data for the scan history.
   */
  async createScanHistory(data: {
    scanDate: Date;
    imageUrl: string;
    scannedBy: number;
    result: string;
    advice: string;
    diseaseId?: number | null;
  }) {
    return await this.prisma.scanHistory.create({ data });
  }

  /**
   * Updates an existing ScanHistory record.
   * @param id - The ID of the scan history record to update.
   * @param data - The fields to update in the scan history record.
   */
  async updateScanHistory(
    id: number,
    data: { result?: string; advice?: string; diseaseId?: number | null },
  ) {
    return await this.prisma.scanHistory.update({
      where: { id },
      data,
    });
  }
}
