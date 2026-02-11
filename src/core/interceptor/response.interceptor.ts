import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request, Response } from 'express'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        // 如果是 POST 请求且状态码是 201，则强制改为 200
        if (request.method === 'POST' && response.statusCode === 201) {
          response.status(200)
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data
      }),
    )
  }
}
