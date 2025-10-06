import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp() // 获取请求上下文
    const response = ctx.getResponse<Response>() // 获取请求上下文中的 response对象
    const status = exception.getStatus() // 获取异常状态码
    const exceptionResponse = exception.getResponse() as { message: string }
    let validMessage = ''

    for (const key in exception) {
      console.log('key', 'exception[key]', key, exception[key])
    }
    if (typeof exceptionResponse === 'object') {
      validMessage =
        typeof exceptionResponse.message === 'string' ? exceptionResponse.message : exceptionResponse.message[0]
    }
    const message = exception.message ? exception.message : `${status >= 500 ? 'Service Error' : 'Client Error'}`
    const errorResponse = {
      data: {},
      message: validMessage || message,
      success: false,
    }

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
