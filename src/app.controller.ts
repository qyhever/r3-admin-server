import * as path from 'path'
import * as fs from 'fs'

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

  @Public()
  @ApiOperation({ summary: 'meta' })
  @Get('meta')
  getMeta(): object {
    const metaStr = fs.readFileSync(path.resolve(__dirname, '../public/meta.json'), 'utf8')
    const meta = JSON.parse(metaStr) as { now: string }
    return meta
  }
}
