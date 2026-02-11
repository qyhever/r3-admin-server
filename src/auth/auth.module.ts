import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '@/user/user.entity'
import { UserModule } from '@/user/user.module'
import { ResourceModule } from '@/resource/resource.module'

import { Role } from '@/role/role.entity'
import { UserRole } from '@/common/user-role.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigEnum } from '@/enum/config.const'
// import { JwtStrategy } from './jwt.strategy'

// const jwtModule = JwtModule.register({
//     secret:"xxx"
// })
// 这里不建议将秘钥写死在代码也， 它应该和数据库配置的数据一样，从环境变量中来
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const secret: string | undefined = configService.get(ConfigEnum.JWT_SECRET)
    if (!secret) {
      throw new Error('JWT secret env is not configured')
    }
    return {
      secret: configService.get(ConfigEnum.JWT_SECRET),
      signOptions: { expiresIn: configService.get(ConfigEnum.JWT_ACCESS_EXPIRE) },
    }
  },
})

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole]), PassportModule, jwtModule, UserModule, ResourceModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [jwtModule],
})
export class AuthModule {}
