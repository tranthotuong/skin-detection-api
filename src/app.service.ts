import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getApiBaseUrl(): string {
    return this.configService.get<string>('BASE_URL');
  }
}
