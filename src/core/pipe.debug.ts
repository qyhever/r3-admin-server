// 自定义管道调试
import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class DebugPipe implements PipeTransform {
  transform(value: unknown) {
    console.log('Pipe received:', value) // 检查输入
    return value
  }
}
