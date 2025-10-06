import { IsNotEmpty, IsArray, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: 'name不可为空' })
  name: string

  @ApiProperty({ description: '角色编码' })
  @IsNotEmpty({ message: 'code不可为空' })
  code: string

  @ApiProperty({ description: '是否启用' })
  @IsBoolean()
  isEnabled: boolean

  @ApiProperty({ description: '描述', required: false })
  description?: string

  @ApiProperty({ description: '资源Code数组', type: [String] })
  @IsArray({ message: 'resourceCodes必须为数组' })
  resourceCodes: string[]

  @IsBoolean()
  @IsOptional()
  isSystemDefault?: boolean
}
