import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ByCultureDto } from './dto/by-culture.dto';
import { ByLandUseDto } from './dto/by-land-use.dto';
import { ByStateDto } from './dto/by-state.dto';
import { SummaryDto } from './dto/summary.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getSummary(): Promise<SummaryDto> {
    return this.dashboardService.getSummary();
  }

  @Get('by-state')
  async getByState(): Promise<ByStateDto[]> {
    return this.dashboardService.getByState();
  }

  @Get('by-culture')
  async getByCulture(): Promise<ByCultureDto[]> {
    return this.dashboardService.getByCulture();
  }

  @Get('by-land-use')
  async getByLandUse(): Promise<ByLandUseDto> {
    return this.dashboardService.getByLandUse();
  }
}
