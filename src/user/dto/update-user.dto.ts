import { IsArray, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ description: 'ID', required: true })
  @IsNotEmpty({ message: 'id不可为空' })
  @IsNumber({}, { message: 'id必须是数字' })
  id: number

  @ApiProperty({ description: '头像地址', required: false })
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  username?: string

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  mobile?: string

  @ApiProperty({ description: '密码', required: false })
  password?: string

  @ApiProperty({ description: 'roleCodes', required: false })
  @IsArray({ message: 'roleCodes必须为数组' })
  @IsOptional()
  roleCodes?: string[]

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
