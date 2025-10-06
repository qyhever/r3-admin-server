import { Column, PrimaryGeneratedColumn } from 'typeorm'
import { Transform, Expose } from 'class-transformer'
import * as dayjs from 'dayjs'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'Unique identifier' })
  id: number

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

  // 添加getter方法获取格式化的日期
  @Expose()
  get createdAtFormatted(): string {
    return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }

  // 添加getter方法获取格式化的日期
  @Expose()
  get updatedAtFormatted(): string {
    return dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }

  @Column({ comment: '是否删除', default: false })
  isDeleted: boolean
}
