import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator'

export class UpdateResourceDto {
  @ApiProperty({ description: 'Resource ID', required: true })
  @IsNotEmpty({ message: 'id不可为空' })
  @IsNumber({}, { message: 'id必须是数字' })
  id: number

  @ApiProperty({ description: 'Resource type', required: false })
  type?: string

  @ApiProperty({ description: 'Parent resource code', required: false })
  parentCode?: string

  @ApiProperty({ description: 'Resource code', required: false })
  code?: string

  @ApiProperty({ description: 'Resource name', required: false })
  name?: string

  @ApiProperty({ description: 'Whether the resource is deleted', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @ApiProperty({ description: 'Whether the resource is enabled', required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @IsBoolean()
  @IsOptional()
  isSystemDefault?: boolean
}
