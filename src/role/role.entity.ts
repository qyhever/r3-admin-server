import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { RoleResource } from '../common/role-resource.entity'
import { UserRole } from '../common/user-role.entity'

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'Unique identifier' })
  declare id: number

  @Column({ comment: 'Role code', length: 50 })
  code: string

  @Column({ comment: 'Role name', length: 50, unique: true })
  @Index('idx_role_name')
  name: string

  @Column({ comment: 'Role description', nullable: true })
  description: string

  @Column({ comment: '启用/禁用', default: true })
  isEnabled: boolean

  @Column({ comment: '系统默认', default: false })
  isSystemDefault: boolean

  // @ManyToMany(() => User, (user) => user.roles)
  // users: User[]

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[]

  // 可以添加一个getter方法
  get users() {
    return this.userRoles ? this.userRoles.map((ur) => ur.user) : []
  }

  @OneToMany(() => RoleResource, (roleResource) => roleResource.role)
  roleResources: RoleResource[]

  get resources() {
    return this.roleResources ? this.roleResources.map((rr) => rr.resource) : []
  }

  // @ManyToMany(() => Resource, (resource) => resource.roles)
  // @JoinTable({
  //   name: 'role_resource',
  //   joinColumn: { name: 'role_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'resource_id', referencedColumnName: 'id' },
  // })
  // resources: Resource[]
}
