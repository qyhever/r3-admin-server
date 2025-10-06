import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { PassportStrategy } from '@nestjs/passport'
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt'
import { User } from '@/user/user.entity'
import { AuthService } from './auth.service'

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secret: string | undefined = configService.get('SECRET')
    if (!secret) {
      throw new Error('JWT secret env is not configured')
    }
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    }
    super(options)
  }

  async validate(user: User) {
    // 直接通过 user id 查询数据库，判断用户是否存在
    const existUser = await this.userRepository.findOne({ where: { id: user.id } })
    if (!existUser) {
      throw new UnauthorizedException('token不正确')
    }
    return existUser
  }
}
