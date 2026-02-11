import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { compareSync } from 'bcryptjs'
import { User } from '@/user/user.entity'
import { UserService } from '@/user/user.service'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './auth.interface'
import { ConfigEnum } from '@/enum/config.const'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const { mobile, password } = dto
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.mobile=:mobile', { mobile })
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
      .getOne()

    if (!user) {
      return {
        error: true,
        message: '手机号不正确',
      }
    }

    // console.log('password: ', password)
    // console.log('user.password: ', user.password)
    const isRight = compareSync(password, user.password)
    if (!isRight) {
      return {
        error: true,
        message: '密码错误',
      }
    }

    if (!user.isEnabled) {
      return {
        error: true,
        message: '用户已禁用',
      }
    }

    return this.buildToken(user)
  }

  async refreshToken(rToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(rToken, {
        secret: this.configService.get(ConfigEnum.JWT_SECRET),
      })

      const user = await this.userRepository.findOne({
        where: {
          id: payload.id,
          isDeleted: false,
        },
      })
      if (!user) {
        throw new UnauthorizedException('用户不存在')
      }
      if (!user.isEnabled) {
        throw new UnauthorizedException('用户已禁用')
      }

      return this.buildToken(user)
    } catch (error: unknown) {
      console.log('error: ', error)
      throw new UnauthorizedException('无效的刷新令牌')
    }
  }

  private buildToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(ConfigEnum.JWT_ACCESS_EXPIRE),
      issuer: this.configService.get(ConfigEnum.JWT_ISSUER),
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(ConfigEnum.JWT_REFRESH_EXPIRE),
      issuer: this.configService.get(ConfigEnum.JWT_ISSUER),
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async getUser(user: User) {
    return await this.userService.findDoc(user.id)
  }
}
