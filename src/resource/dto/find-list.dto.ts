import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString, ArrayMaxSize } from 'class-validator'

/**
 * 资源模块分页查询参数
 * - 用于资源列表的分页、排序与筛选
 */
export class ResourceFindListDto {
  @ApiPropertyOptional({ description: '当前页，默认 1' })
  currentPage?: number

  @ApiPropertyOptional({ description: '每页显示条数，默认 10' })
  pageSize?: number

  @ApiPropertyOptional({ description: '排序字段' })
  sortField?: string

  @ApiPropertyOptional({ description: '排序方式', enum: ['asc', 'desc', ''] })
  @IsEnum(['asc', 'desc', ''], { message: 'sortValue must be either asc or desc or ""' })
  sortValue?: 'asc' | 'desc' | ''

  @ApiPropertyOptional({ description: '父级code' })
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  parentCode?: string

  @ApiPropertyOptional({ description: 'code' })
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  code?: string

  @ApiPropertyOptional({ description: '名称' })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string

  @ApiPropertyOptional({ description: '类型' })
  @IsOptional()
  @IsString({ message: 'type must be a string' })
  type?: string

  @ApiPropertyOptional({ description: '启用/禁用' })
  @IsOptional()
  @IsString({ message: 'isEnabled must be a string' })
  isEnabled?: string

  @ApiPropertyOptional({ description: '日期范围', type: [String] })
  @IsOptional()
  @IsArray({ message: 'rangeDate must be an array' })
  @ArrayMaxSize(2, { message: 'rangeDate can have at most 2 items' })
  rangeDate?: string[]
}
