import { Controller, Get, Post, Put, Delete, Param, Body, Req } from '@nestjs/common' // 导入控制器和 HTTP 请求装饰器
import { ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service' // 导入用户服务
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindListDto } from './dto/find-list.dto'
import { Public } from '@/auth/decorators/public.decorator'
import { User } from './user.entity'
import { Request } from 'express'
import { JwtPayload } from '@/auth/auth.interface'

class FindListVo {
  success: true
  data: {
    list: User[] // 用户列表
    total: number // 总数
  }
}

@ApiTags('用户')
@Controller('user')
export class UserController {
  /**
   * 构造函数
   * - 注入用户服务
   * @param userService 用户服务
   */
  constructor(private userService: UserService) {}
  /**
   * 新增用户
   * - 路由：POST /user
   */
  @Public()
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateUserDto })
  @Post('')
  createRow(@Body() createUser: CreateUserDto) {
    return this.userService.createDoc(createUser)
  }
  /**
   * 更新用户
   * - PUT /user
   */
  @Public()
  @ApiOperation({ summary: '更新' })
  @ApiBody({ type: UpdateUserDto })
  @Put('')
  updateRow(@Body() dto: UpdateUserDto) {
    return this.userService.updateDoc(dto)
  }
  /**
   * 分页查询
   * - 路由：GET /user
   */
  @Public()
  @ApiOperation({ summary: '分页查询' })
  @ApiBody({ type: FindListDto })
  @ApiOkResponse({ description: '响应结果', type: FindListVo })
  // @ApiBearerAuth() // swagger文档设置
  @Post('/pagedList')
  getPagedRows(@Body() dto: FindListDto) {
    return this.userService.findList(dto)
  }
  /**
   * 获取当前用户信息
   * - 路由：GET /user/info
   * 必须放在 /user/:id 路由前面，不然匹配不到
   */
  @ApiOperation({ summary: '获取当前用户信息' })
  @Get('/info')
  getUserInfo(@Req() req: Request) {
    const user = req.user as JwtPayload
    return this.userService.findDoc(user.id)
  }
  /**
   * 查询详情
   * - 路由：GET /user/:id
   */
  @ApiOperation({ summary: '查询详情' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  // @ApiBearerAuth() // swagger文档设置token
  @Get(':id')
  getUserDetail(@Param('id') id: string) {
    return this.userService.findDoc(Number(id))
  }
  /**
   * 删除
   * - 路由：DELETE /user/:id
   */
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Delete('/:id')
  deleteRow(@Param('id') id: number) {
    return this.userService.deleteDoc(id)
  }
  /**
   * 批量删除
   * - 路由：POST /user/batchDelete
   */
  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ type: Number, isArray: true })
  @Post('/batchDelete')
  deleteRows(@Body() ids: number[]) {
    return this.userService.deleteDocs(ids)
  }
}
