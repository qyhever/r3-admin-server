import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from '@/auth/decorators/public.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Public()
  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'r3-admin-server',
      version: process.env.npm_package_version || '1.0.0',
    }
  }
}
