import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsArray, ArrayMaxSize } from 'class-validator'

/**
 * 用户模块分页查询参数
 * - 用于用户列表的分页、排序与筛选
 */
export class UserFindListDto {
  @ApiProperty({ description: '当前页，默认 1', required: false })
  currentPage?: number

  @ApiProperty({ description: '每页显示条数，默认 10', required: false })
  pageSize?: number

  @ApiPropertyOptional({ description: '排序字段' })
  sortField?: string

  @ApiPropertyOptional({ description: '排序方式', enum: ['asc', 'desc', ''] })
  @IsEnum(['asc', 'desc', ''], { message: 'sortValue must be either asc or desc or ""' })
  @IsOptional()
  sortValue?: 'asc' | 'desc' | ''

  @ApiProperty({ description: '用户名', required: false })
  username?: string

  @ApiProperty({ description: '手机号', required: false })
  mobile?: string

  @ApiPropertyOptional({ description: '日期范围', type: [String] })
  @IsOptional()
  @IsArray({ message: 'rangeDate must be an array' })
  @ArrayMaxSize(2, { message: 'rangeDate can have at most 2 items' })
  rangeDate?: string[]
}
