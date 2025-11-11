import type { INestApplication } from '@nestjs/common'
import { resolve } from 'path'
import type { Request, Response } from 'express'

interface Service {
  name: string
  url: string
  swaggerVersion: string
  location: string
}
export async function knife4jSetup(app: INestApplication, services: Service[]) {
  let expressStatic: (root: string, options?: any) => any
  try {
    expressStatic = await import('express').then((mod) => mod.static)
  } catch (error) {
    throw new Error('Express is not installed', { cause: error })
  }
  app.use('/', expressStatic(resolve(__dirname, '../public/')))
  app.use('/services.json', (_: Request, res: Response) => {
    res.send(services)
  })
  app.use('/swagger-resources', (_: Request, res: Response) => {
    res.send(services)
  })
}
