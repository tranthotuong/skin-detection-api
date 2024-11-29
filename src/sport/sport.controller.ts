import { Controller, Get, UseGuards } from '@nestjs/common';
import { SportService } from './sport.service';
import { TokenValidationGuard } from 'src/guards/token-validation.guard';

@Controller('sport')
export class SportController {
    constructor(private readonly sportsService: SportService) {}

    // GET /sports
    @Get()
    @UseGuards(TokenValidationGuard)
    async getAllSports() {
      return this.sportsService.getAllSports();
    }
}
