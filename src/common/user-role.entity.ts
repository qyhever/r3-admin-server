import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn, Index } from 'typeorm'
import { Transform } from 'class-transformer'
import * as dayjs from 'dayjs'
import { User } from '@/user/user.entity'
import { Role } from '@/role/role.entity'

@Entity('user_role')
export class UserRole {
  @PrimaryColumn({ comment: 'User ID' })
  userId: number

  @PrimaryColumn({ comment: 'Role ID' })
  @Index('idx_role_id')
  roleId: number

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role

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
