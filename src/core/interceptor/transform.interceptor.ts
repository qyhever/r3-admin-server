import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { instanceToPlain } from 'class-transformer'

interface Response<T> {
  data: T
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: { error: boolean; message: string; [propName: string]: unknown }) => {
        if (data && data.error) {
          return {
            data: null,
            success: false,
            msg: data.message || '请求失败',
            details: data.details,
          }
        }
        return {
          data: instanceToPlain(data),
          success: true,
          msg: '请求成功',
        }
      }),
    )
  }
}
