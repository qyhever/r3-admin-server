import type { INestApplication } from '@nestjs/common'
import { resolve } from 'path'
interface Service {
  name: string
  url: string
  swaggerVersion: string
  location: string
}
export async function knife4jSetup(app: INestApplication, services: Service[]) {
  let expressStatic: any
  try {
    expressStatic = await import('express').then((mod) => mod.static)
  } catch (error) {
    throw new Error('Express is not installed', error)
  }
  app.use('/', expressStatic(resolve(__dirname, '../public/')))
  app.use('/services.json', (_, res: any) => {
    res.send(services)
  })
  app.use('/swagger-resources', (_, res: any) => {
    res.send(services)
  })
}
