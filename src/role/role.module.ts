import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Resource } from '@/resource/resource.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { Role } from './role.entity'
import { RoleResource } from '@/common/role-resource.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Role, Resource, RoleResource])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
