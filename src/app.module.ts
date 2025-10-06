import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
// 用于解析 .env 文件
// import * as dotenv from 'dotenv';
import * as Joi from 'joi'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigEnum } from './enum/config.const'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { User } from './user/user.entity'
import { Role } from './role/role.entity'
import { Resource } from './resource/resource.entity'
import { UserRole } from './common/user-role.entity'
import { RoleResource } from './common/role-resource.entity'
import { PostsModule } from './posts/posts.module'
import { ResourceModule } from './resource/resource.module'
import { RoleModule } from './role/role.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/jwt.guard'

// 动态生成环境变量文件路径：加载对应的 `.env.[NODE_ENV]` 文件
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      /**
       * 使用 Joi 验证环境变量：
       * - 定义环境变量的结构和默认值
       * - 确保环境变量的值符合预期（如类型、范围等）
       */
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.string().required(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRE: Joi.string().default('4h'),
      }),
      // load: [Configuration], // 可选：加载自定义配置文件
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE), // 数据库类型
          host: configService.get(ConfigEnum.DB_HOST), // 数据库主机地址
          port: configService.get(ConfigEnum.DB_PORT), // 数据库端口
          username: configService.get(ConfigEnum.DB_USERNAME), // 数据库用户名
          password: configService.get(ConfigEnum.DB_PASSWORD), // 数据库密码
          database: configService.get(ConfigEnum.DB_DATABASE), // 数据库名称
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities: [User, Role, Resource, UserRole, RoleResource], // 实体类数组
          synchronize: configService.get(ConfigEnum.DB_SYNC), // 是否自动同步数据库结构
          // logging: ["error", "warn"], // 日志级别
          logging: process.env.NODE_ENV === 'development', // 日志
          // logging: false,
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
    PostsModule,
    ResourceModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
