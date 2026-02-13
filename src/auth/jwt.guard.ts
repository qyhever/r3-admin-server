import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtPayload } from './auth.interface'
import { ConfigEnum } from '@/enum/config.const'
import { ResponseMessageEnum } from '@/enum/response-message.enum'

interface RequestWithUser extends Request {
  user: JwtPayload
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector, // 用于获取装饰器的元数据
  ) {}

  /**
   * 判断请求是否通过身份验证
   * @param context 执行上下文
   * @returns 是否通过身份验证
   */
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      //即将调用的方法
      context.getHandler(),
      //controller类型
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>() // 获取请求对象
    const token = this.extractTokenFromHeader(request) // 从请求头中提取token
    console.log('token: ', token)
    if (!token) {
      throw new HttpException(ResponseMessageEnum.PLEASE_LOGIN_FIRST, HttpStatus.UNAUTHORIZED)
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get(ConfigEnum.JWT_SECRET), // 使用JWT_SECRET解析token
      })
      request.user = payload // 将解析后的用户信息存储在请求对象中
    } catch {
      throw new HttpException(ResponseMessageEnum.LOGIN_STATUS_INVALID, HttpStatus.UNAUTHORIZED)
    }

    return true
  }

  /**
   * 从请求头中提取token
   * @param request 请求对象
   * @returns 提取到的token
   */
  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
}
