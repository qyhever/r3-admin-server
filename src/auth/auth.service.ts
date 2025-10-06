import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { User } from '@/user/user.entity'
import { UserService } from '@/user/user.service'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: LoginDto) {
    const { mobile, password } = dto
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.mobile=:mobile', { mobile })
      .getOne()

    if (!user) {
      return {
        error: true,
        message: '手机号不正确',
      }
    }

    console.log('password: ', password)
    console.log('user.password: ', user.password)
    const isRight = compareSync(password, user.password)
    if (!isRight) {
      return {
        error: true,
        message: '密码错误',
      }
    }
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      mobile: user.mobile,
    }
    const token = this.jwtService.sign(payload)

    return token
  }

  async getUser(user: User) {
    return await this.userService.findDoc(user.id)
  }
}
