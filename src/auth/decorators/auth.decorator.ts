import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../jwt.guard'

// 在控制器中使用
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
// ->
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// ->
// @Auth()
// @Get(':id')
// getDoc () {}

export function Auth() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard))
}
