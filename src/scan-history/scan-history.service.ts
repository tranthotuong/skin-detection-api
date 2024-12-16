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

  /**
   * Retrieves the top 10 most recent ScanHistory records
   * @returns 
   */
  async getTop10History() {
    return await this.prisma.scanHistory.findMany({
      orderBy: {
        scanDate: 'desc', // Sort by the most recent scan date
      },
      take: 10, // Limit to top 10 records
      select: {
        id: true,
        imageUrl: true,
        diseaseId: true,
        scanDate: true,
        disease: {
          select: {
            name: true, // Fetch the disease name
          },
        },
      },
    });
  }
  /**
   * Tuong.TT 2024-12-15
   * Get List Histories
   * @param diseaseName 
   * @param sortOrder 
   * @returns 
   */
  async getHistories(diseaseName: string, sortOrder: 'asc' | 'desc') {
    return await this.prisma.scanHistory.findMany({
      where: {
        disease: {
          name: {
            contains: diseaseName, // Matches partial or full disease names
            mode: 'insensitive', // Case-insensitive search
          },
        },
      },
      orderBy: {
        scanDate: sortOrder, // Sort dynamically by scanDate (asc or desc)
      },
      select: {
        id: true,
        imageUrl: true,
        diseaseId: true,
        scanDate: true,
        disease: {
          select: {
            name: true, // Fetch the disease name
          },
        },
      },
    });
  }
}
