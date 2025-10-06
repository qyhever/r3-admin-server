import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsArray, ArrayMaxSize } from 'class-validator'

export class FindListDto {
  @ApiProperty({ description: '当前页，默认 1', required: false })
  currentPage?: number

  @ApiProperty({ description: '每页显示条数，默认 10', required: false })
  pageSize?: number

  @ApiProperty({ description: 'code', required: false })
  code?: string

  @ApiProperty({ description: '名称', required: false })
  name?: string

  @ApiPropertyOptional({ description: '排序字段' })
  sortField?: string

  @ApiPropertyOptional({ description: '排序方式', enum: ['asc', 'desc', ''] })
  @IsEnum(['asc', 'desc', ''], { message: 'sortValue must be either asc or desc or ""' })
  sortValue?: 'asc' | 'desc' | ''

  @ApiPropertyOptional({ description: '日期范围', type: [String] })
  @IsOptional()
  @IsArray({ message: 'rangeDate must be an array' })
  @ArrayMaxSize(2, { message: 'rangeDate can have at most 2 items' })
  rangeDate?: string[]
}
