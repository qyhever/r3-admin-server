import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'
import { Resource } from './resource.entity'
import { RoleResource } from '../common/role-resource.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Resource, RoleResource])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
