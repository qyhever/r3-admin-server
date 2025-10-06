import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './core/filter/http-exception.filter'
import { TransformInterceptor } from './core/interceptor/transform.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import type { INestApplication } from '@nestjs/common'
import { knife4jSetup } from './knife4j'

async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('R3 Admin API')
    .setDescription('The R3 Admin API description')
    .setVersion('1.0')
    // .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  await knife4jSetup(app, [
    {
      name: '2.0 version',
      url: `/api-json`,
      swaggerVersion: '2.0',
      location: `/api-json`,
    },
  ])
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // app.setGlobalPrefix('/api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  // 添加全局验证管道，并启用转换
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用转换
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  setupSwagger(app)
  // Add handler for Chrome DevTools workspace folders
  // app.use('/.well-known/appspecific/com.chrome.devtools.json', (_, res) => {
  //   res.json({
  //     workspace: {
  //       root: process.cwd(),
  //       uuid: '53b029bb-c989-4dca-969b-835fecec3717' // You can generate a random UUID
  //     }
  //   });
  // });
  await app.listen(process.env.PORT ?? 9506)
}
bootstrap()
