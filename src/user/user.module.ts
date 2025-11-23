import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'

import { ResourceModule } from '@/resource/resource.module'
import { User } from './user.entity'
import { Role } from '@/role/role.entity'
import { UserRole } from '../common/user-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole]), ResourceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
