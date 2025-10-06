import { SetMetadata } from '@nestjs/common'

// 创建 @Public() 装饰器，支持在控制器类和方法上使用
export function Public() {
  return SetMetadata('isPublic', true)
}
