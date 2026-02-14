import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: 'mobile不可为空' })
  mobile: string

  @ApiProperty({ description: '旧密码' })
  @IsNotEmpty({ message: 'password不可为空' })
  password: string

  @ApiProperty({ description: '新密码' })
  @IsNotEmpty({ message: 'newPassword不可为空' })
  newPassword: string
}
