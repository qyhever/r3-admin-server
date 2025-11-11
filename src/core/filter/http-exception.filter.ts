import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 全局异常捕获
   * - 捕获 HttpException 及未知异常
   * - 统一结构化响应并输出调试日志
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp() // 获取请求上下文
    const response = ctx.getResponse<Response>() // 获取 response 对象

    // 入口日志：确认过滤器是否生效（避免直接访问 any 的 constructor）
    const typeTag = Object.prototype.toString.call(exception) as string
    console.log('[HttpExceptionFilter] catch triggered:', typeTag)

    // 打印异常的属性名，for...in 无法枚举 Error/HttpException 的非可枚举属性
    try {
      if (exception && (typeof exception === 'object' || typeof exception === 'function')) {
        const ownProps = Object.getOwnPropertyNames(exception)
        console.log('[HttpExceptionFilter] ownProps:', ownProps)
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.log('[HttpExceptionFilter] ownProps error:', errMsg)
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'
    // 将有效信息默认设置为错误堆栈，便于定位问题
    let validMessage = ''
    if (exception instanceof Error) {
      const name = exception.name || 'Error'
      const stack = exception.stack || ''
      validMessage = `${name}: ${exception.message}\n${stack}`
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus() // 获取异常状态码
      const exceptionResponse = exception.getResponse() // string | object
      console.log('[HttpExceptionFilter] exceptionResponse type:', typeof exceptionResponse)

      if (typeof exceptionResponse === 'object' && exceptionResponse && !validMessage) {
        const respObj = exceptionResponse as Record<string, unknown>
        const msgVal = respObj['message']
        if (typeof msgVal === 'string') {
          validMessage = msgVal
        } else if (Array.isArray(msgVal) && msgVal.length > 0 && typeof msgVal[0] === 'string') {
          validMessage = msgVal[0]
        }
      }
      if (exception.message) {
        message = exception.message
      }
    } else if (exception && typeof exception === 'object') {
      const maybeMsg = (exception as Record<string, unknown>)['message']
      if (typeof maybeMsg === 'string' && maybeMsg) {
        message = maybeMsg
      }
    }

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
