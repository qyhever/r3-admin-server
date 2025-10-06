import { Controller, Get, Post, Put, Delete, Query, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger'
import { ResourceService } from './resource.service'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { FindListDto } from './dto/find-list.dto'
import { FindAllDto } from './dto/find-all.dto'
import { BatchUpdateRowsByIdsDto } from './dto/batch-update-by-ids.dto'

@ApiTags('资源')
@Controller('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}
  /**
   * 新增
   * - 路由：POST /resource
   */
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateResourceDto })
  @Post('')
  createRow(@Body() dto: CreateResourceDto) {
    return this.resourceService.createDoc(dto)
  }
  /**
   * 批量新增
   * - 路由：POST /resource/batchCreate
   */
  @ApiOperation({ summary: '批量新增' })
  @ApiBody({ type: [CreateResourceDto] })
  @Post('/batchCreate')
  batchCreateRows(@Body() dtos: CreateResourceDto[]) {
    return this.resourceService.batchCeateDoc(dtos)
  }
  /**
   * 更新
   * - 路由：PUT /resource
   */
  @ApiOperation({ summary: '更新' })
  @ApiBody({ type: UpdateResourceDto })
  @Put('')
  updateRow(@Body() dto: UpdateResourceDto) {
    return this.resourceService.updateDoc(dto)
  }
  /**
   * 分页查询
   * - 路由：POST/resource
   */
  @ApiOperation({ summary: '分页查询' })
  @ApiBody({ type: FindListDto })
  @Post('/pagedList')
  getPagedRows(@Body() dto: FindListDto) {
    console.log('dto: ', dto)
    return this.resourceService.findList(dto)
  }
  /**
   * 查询所有
   * - 路由：GET /resource/findAll
   */
  @ApiOperation({ summary: '查询所有' })
  @ApiQuery({ type: FindAllDto })
  @Get('/findAll')
  getAllRows(@Query() dto: FindAllDto) {
    return this.resourceService.findAll(dto)
  }
  /**
   * 查询详情
   * - 路由：GET /resource/:id
   */
  @ApiOperation({ summary: '查询详情' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Get('/:id')
  getRow(@Param('id') id: number) {
    return this.resourceService.findDoc(id)
  }
  /**
   * 删除
   * - 路由：DELETE /resource/:id
   */
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: 'ID' })
  @Delete('/:id')
  deleteRow(@Param('id') id: number) {
    return this.resourceService.deleteDoc(id)
  }
  /**
   * 批量删除
   * - 路由：POST /resource/batchDelete
   */
  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ type: [Number] })
  @Post('/batchDelete')
  deleteRows(@Body() ids: number[]) {
    return this.resourceService.deleteDocs(ids)
  }
  /**
   * 批量更新
   * - 路由：POST /resource/batchUpdateByIds
   */
  @Post('/batchUpdateByIds')
  batchUpdateRowsByIds(@Body() dto: BatchUpdateRowsByIdsDto) {
    return this.resourceService.batchUpdateByIds(dto.row, dto.ids)
  }
}
