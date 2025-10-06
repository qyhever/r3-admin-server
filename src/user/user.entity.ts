import { Column, Entity, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm'
// import * as bcrypt from 'bcryptjs'
// import { Role } from '../role/role.entity'
import { BaseEntity } from '../common/base.entity'
import { UserRole } from '../common/user-role.entity'

/**
 * User entity for authentication and authorization
 */
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'Unique identifier' })
  declare id: number

  @Column({ comment: '头像URL' })
  avatar: string

  @Column({ comment: 'Login username', length: 50 })
  @Index('idx_username')
  username: string

  @Column({ comment: '手机号', length: 11 })
  mobile: string

  @Column({ comment: 'Hashed password', select: false })
  password: string

  @Column({ comment: '启用/禁用', default: true })
  isEnabled: boolean

  @Column({ comment: '系统默认', default: false })
  isSystemDefault: boolean

  // @ManyToMany(() => Role, (role) => role.users)
  // @JoinTable({
  //   name: 'user_roles',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  // })
  // roles: Role[]

  // 使用OneToMany替代ManyToMany
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[]

  // 添加一个getter方法来方便获取角色
  get roles() {
    return this.userRoles ? this.userRoles.map((ur) => ur.role) : []
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // encryptPwd() {
  //   this.password = bcrypt.hashSync(this.password, 10)
  // }
}
