import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SportService {
    constructor(private readonly prisma: PrismaService) {}

    // Fetch all sports
    async getAllSports() {
      return this.prisma.sport.findMany({
        orderBy: {
          sortOrder: 'asc', // Sort by sortOrder ascending
        },
      });
    }
}
