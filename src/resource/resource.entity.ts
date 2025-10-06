import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { RoleResource } from '../common/role-resource.entity'

/**
 * Resource entity representing protected resources
 */
@Entity()
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'Unique identifier' })
  declare id: number

  @Column({ comment: '权限类型 1目录/2资源', length: 1 })
  type: string

  @Column({ comment: '父级', length: 60 })
  parentCode: string

  @Column({ comment: '权限码', length: 50 })
  code: string

  @Column({ comment: '权限名', length: 50 })
  @Index('idx_resource_name')
  name: string

  // @Column({ comment: '启用/禁用', default: true, select: false, transformer: { to: (value) => value ? 1 : 0, from: (value) => !!value }  })
  @Column({ comment: '启用/禁用', default: true })
  isEnabled: boolean

  @Column({ comment: '系统默认', default: false })
  isSystemDefault: boolean

  @OneToMany(() => RoleResource, (roleResource) => roleResource.resource)
  roleResources: RoleResource[]

  get roles() {
    return this.roleResources ? this.roleResources.map((rr) => rr.role) : []
  }
}
