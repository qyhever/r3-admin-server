import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from './user.entity'
import { Role } from '@/role/role.entity'
import { UserRole } from '../common/user-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
