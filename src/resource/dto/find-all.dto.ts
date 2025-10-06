import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAllDto {
  @IsOptional()
  isDeleted?: string

  @ApiPropertyOptional({ description: '启用/禁用' })
  @IsOptional()
  isEnabled?: string
}
