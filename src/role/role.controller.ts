import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleFindListDto } from './dto/find-list.dto'

@ApiTags('角色')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  /**
   * 新增
   * - 路由：POST /role
   */
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateRoleDto })
  @Post('')
  createRow(@Body() dto: CreateRoleDto) {
    return this.roleService.createDoc(dto)
  }
  /**
   * 更新
   * - 路由：PUT /role
   */
  @ApiOperation({ summary: '更新' })
  @ApiBody({ type: UpdateRoleDto })
  @Put('')
  updateRow(@Body() dto: UpdateRoleDto) {
    return this.roleService.updateDoc(dto)
  }
  /**
   * 分页查询
   * - 路由：POST /role
   */
  @ApiOperation({ summary: '分页查询' })
  @ApiBody({ type: RoleFindListDto })
  @Post('/pagedList')
  /**
   * 分页查询角色列表
   * - 接收 RoleFindListDto 作为查询参数
   */
  getPagedRows(@Body() dto: RoleFindListDto) {
    return this.roleService.findList(dto)
  }
  /**
   * 查询所有
   * - 路由：GET /role/findAll
   */
  @ApiOperation({ summary: '查询所有' })
  @Get('/findAll')
  getAllRows() {
    return this.roleService.findAll()
  }
  /**
   * 查询详情
   * - 路由：GET /role/:id
   */
  @ApiOperation({ summary: '查询详情' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Get('/:id')
  getRow(@Param('id') id: number) {
    return this.roleService.findDoc(id)
  }
  /**
   * 删除
   * - 路由：DELETE /role/:id
   */
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Delete('/:id')
  deleteRow(@Param('id') id: number) {
    return this.roleService.deleteDoc(id)
  }
  /**
   * 批量删除
   * - 路由：POST /role/batchDelete
   */
  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ type: [Number] })
  @Post('/batchDelete')
  deleteRows(@Body() ids: number[]) {
    return this.roleService.deleteDocs(ids)
  }

  /**
   * 切换状态
   * - 路由：POST /role/toggleStatus/:id
   */
  @ApiOperation({ summary: '切换状态' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Patch('/toggleStatus/:id')
  toggleStatus(@Param('id') id: number) {
    return this.roleService.toggleStatus(id)
  }
}
