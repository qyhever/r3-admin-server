import { IsArray, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: '头像地址' })
  @IsOptional()
  avatar: string

  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: 'username不可为空' })
  username: string

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: 'mobile不可为空' })
  mobile: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: 'password不可为空' })
  password: string

  @ApiProperty({ description: '是否启用' })
  @IsBoolean()
  isEnabled: boolean

  @ApiProperty({ description: 'roleCodes', type: [String] })
  @IsArray({ message: 'roleCodes必须为数组' })
  roleCodes: string[]
}
