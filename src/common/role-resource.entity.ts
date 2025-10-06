import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column, Index } from 'typeorm'
import { Transform } from 'class-transformer'
import * as dayjs from 'dayjs'
import { Role } from '@/role/role.entity'
import { Resource } from '@/resource/resource.entity'

@Entity('role_resource')
export class RoleResource {
  @PrimaryColumn({ comment: 'Role ID' })
  roleId: number

  @PrimaryColumn({ comment: 'Resource ID' })
  @Index('idx_resource_id')
  resourceId: number

  @ManyToOne(() => Role, (role) => role.roleResources)
  @JoinColumn({ name: 'roleId' })
  role: Role

  @ManyToOne(() => Resource, (resource) => resource.roleResources)
  @JoinColumn({ name: 'resourceId' })
  resource: Resource

  @Transform(({ value }): string => {
    if (value instanceof Date) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
    return value
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Transform(({ value }): string => {
    if (value instanceof Date) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
    return value
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ comment: '是否删除', default: false })
  isDeleted: boolean
}
