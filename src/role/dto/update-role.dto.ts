import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator'

export class UpdateRoleDto {
  @ApiProperty({ description: 'Role ID', required: true })
  @IsNotEmpty({ message: 'id不可为空' })
  @IsNumber({}, { message: 'id必须是数字' })
  id: number

  @ApiProperty({ description: 'Role code', required: false })
  code?: string

  @ApiProperty({ description: 'Role name', required: false })
  name?: string

  @ApiProperty({ description: 'Role description', required: false })
  description?: string

  @ApiProperty({ description: 'Resource Codes associated with the role', required: false })
  @IsArray({ message: 'resourceCodes必须为数组' })
  @IsOptional()
  resourceCodes?: string[]

  @ApiProperty({ description: 'Whether the role is deleted', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @ApiProperty({ description: 'Whether the role is enabled', required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @IsBoolean()
  @IsOptional()
  isSystemDefault?: boolean
}
