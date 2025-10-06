import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from './decorators/public.decorator'

// 中间件(Middleware) → 守卫(Guard) → 拦截器(Interceptor) → 管道(Pipe) → 控制器(Controller)

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto })
  @Public()
  @Post('login')
  // @UseGuards(AuthGuard('local'))
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user)
  }
}
