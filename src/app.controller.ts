import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { Public } from '@/auth/decorators/public.decorator'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOperation({ summary: 'hello' })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Public()
  @ApiOperation({ summary: 'health' })
  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toLocaleString(),
      service: 'r3-admin-server',
      version: process.env.npm_package_version || '1.0.0',
    }
  }
}
