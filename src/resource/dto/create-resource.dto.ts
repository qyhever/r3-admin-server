import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateResourceDto {
  @ApiProperty({ description: 'code' })
  @IsNotEmpty()
  code: string

  @ApiProperty({ description: '名称' })
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({ description: '类型' })
  type?: string

  @ApiPropertyOptional({ description: '父级code' })
  parentCode?: string

  @ApiProperty({ description: '是否启用' })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @IsBoolean()
  @IsOptional()
  isSystemDefault?: boolean
}
