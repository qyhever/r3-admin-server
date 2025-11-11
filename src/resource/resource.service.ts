import { HttpException, Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not } from 'typeorm'
import { Resource } from './resource.entity'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { ResourceFindListDto } from './dto/find-list.dto'
import { FindAllDto } from './dto/find-all.dto'

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}
  async createDoc(dto: CreateResourceDto) {
    const { type = '2', parentCode = '', code, name, isEnabled = true, isSystemDefault = false } = dto
    const doc = await this.resourceRepository.findOne({
      where: { code },
    })
    if (doc) {
      // throw new HttpException('权限码已存在', HttpStatus.BAD_REQUEST)
      return {
        error: true,
        message: 'code编码已存在',
      }
    }
    const newDoc = new Resource()
    newDoc.type = type
    newDoc.parentCode = parentCode
    newDoc.code = code
    newDoc.name = name
    newDoc.isEnabled = isEnabled
    newDoc.isSystemDefault = isSystemDefault
    return this.resourceRepository.save(newDoc)
  }
  async batchCeateDoc(dtos: CreateResourceDto[]) {
    // Validate that we have resources to create
    if (!dtos || dtos.length === 0) {
      throw new HttpException('No resources to create', HttpStatus.BAD_REQUEST)
    }

    // Check for duplicate codes within the batch
    const codes = dtos.map((item) => item.code)
    const uniqueCodes = new Set(codes)
    if (uniqueCodes.size !== codes.length) {
      throw new HttpException('Batch contains duplicate resource codes', HttpStatus.BAD_REQUEST)
    }

    // Check if any codes already exist in the database
    const existingResources = await this.resourceRepository.find({
      where: { code: In(codes) },
    })

    if (existingResources.length > 0) {
      const existingCodes = existingResources.map((resource) => resource.code).join(', ')
      throw new HttpException(`Resources with codes already exist: ${existingCodes}`, HttpStatus.BAD_REQUEST)
    }

    // Create new resource entities
    const newResources = dtos.map((item) => {
      const newResource = new Resource()
      newResource.type = item.type || '2'
      newResource.parentCode = item.parentCode || ''
      newResource.code = item.code
      newResource.name = item.name
      newResource.isSystemDefault = typeof item.isSystemDefault === 'boolean' ? item.isSystemDefault : false
      return newResource
    })

    // Save all resources in a single transaction
    return this.resourceRepository.save(newResources)
  }
  async updateDoc(dto: UpdateResourceDto) {
    const { id, code, name, type, parentCode, isDeleted, isEnabled, isSystemDefault } = dto

    // 检查资源是否存在
    const resource = await this.resourceRepository.findOne({
      where: { id },
    })

    if (!resource) {
      // throw new HttpException(`未找到资源`, HttpStatus.NOT_FOUND)
      return {
        error: true,
        message: 'Doc not found',
      }
    }

    if (resource.isSystemDefault) {
      return {
        error: true,
        message: '系统内置资源不能修改',
      }
    }

    if (code) {
      const existingSameCodeDoc = await this.resourceRepository.findOne({ where: { code, id: Not(id) } })
      if (existingSameCodeDoc) {
        return {
          error: true,
          message: 'code编码已存在',
        }
      }
    }

    // 更新资源信息
    if (code !== undefined) {
      resource.code = code
    }
    if (name !== undefined) {
      resource.name = name
    }
    if (type !== undefined) {
      resource.type = type
    }
    if (parentCode !== undefined) {
      resource.parentCode = parentCode
    }
    if (isDeleted !== undefined) {
      resource.isDeleted = isDeleted
    }
    if (isEnabled !== undefined) {
      resource.isEnabled = isEnabled
    }
    if (isSystemDefault !== undefined) {
      resource.isSystemDefault = isSystemDefault
    }

    // 保存更新后的资源
    return this.resourceRepository.save(resource)
  }
  /**
   * 分页查询resource
   * @returns Paginated and sorted resorce list
   */
  /**
   * 分页查询资源
   * - 使用 ResourceFindListDto 作为查询参数类型
   */
  async findList(dto: ResourceFindListDto) {
    const queryBuilder = this.resourceRepository.createQueryBuilder('resource')
    const { currentPage = 1, pageSize = 10 } = dto
    const skip = (currentPage - 1) * pageSize
    // 添加条件过滤已删除的资源
    queryBuilder.andWhere('resource.isDeleted = :isDeleted', {
      isDeleted: false,
    })
    if (dto.isEnabled) {
      queryBuilder.andWhere('resource.isEnabled = :isEnabled', {
        isEnabled: Boolean(dto.isEnabled),
      })
    }
    if (dto.parentCode) {
      queryBuilder.andWhere('parentCode like :parentCode', {
        parentCode: `%${dto.parentCode}%`,
      })
    }
    if (dto.code) {
      queryBuilder.andWhere('code like :code', { code: `%${dto.code}%` })
    }
    if (dto.name) {
      queryBuilder.andWhere('name like :name', { name: `%${dto.name}%` })
    }
    if (dto.type) {
      queryBuilder.andWhere('type like :type', { type: `%${dto.type}%` })
    }
    if (dto.rangeDate && dto.rangeDate.length === 2) {
      const [start, end] = dto.rangeDate
      queryBuilder.andWhere('resource.createdAt BETWEEN :start AND :end', { start, end })
    }
    if (dto.sortField && dto.sortValue) {
      // 使用传入的排序字段和排序方式
      queryBuilder.orderBy(`resource.${dto.sortField}`, dto.sortValue === 'asc' ? 'ASC' : 'DESC')
    } else {
      // 默认排序方式
      queryBuilder.orderBy('resource.createdAt', 'DESC')
    }

    const [list, total] = await queryBuilder
      // .orderBy('resource.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount()
    return {
      list,
      total,
    }
  }
  /**
   * 查询详情
   * @returns Resource
   */
  async findDoc(id: number) {
    // 检查资源是否存在
    const doc = await this.resourceRepository.findOne({
      where: { id, isDeleted: false },
    })
    if (!doc) {
      // throw new HttpException(`未找到资源`, HttpStatus.NOT_FOUND)
      return {
        error: true,
        message: 'Doc not found',
      }
    }
    return doc
  }
  /**
   * 删除
   * @returns Resource
   */
  async deleteDoc(id: number) {
    // 检查资源是否存在
    const doc = await this.resourceRepository.findOne({
      where: { id },
    })
    if (!doc) {
      return {
        error: true,
        message: 'Doc not found',
      }
    }
    if (doc.isSystemDefault) {
      return {
        error: true,
        message: '系统内置资源不能删除',
      }
    }
    // 删除中间表中的关联关系
    // if (doc.roles && doc.roles.length > 0) {
    //   doc.roles = []; // 清空关联关系
    //   await this.resourceRepository.save(doc); // 先保存以更新关联关系
    // }
    // 软删除，将 isDeleted 设置为 true
    doc.isDeleted = true // 保存更新后的资源
    await this.resourceRepository.save(doc)
    // // 删除资源并返回删除前的资源信息
    // await this.resourceRepository.remove(doc)
    return doc
  }
  /**
   * 批量删除
   */
  async deleteDocs(ids: number[]) {
    const docs = await this.resourceRepository.find({
      where: { id: In(ids) },
    })

    if (!docs.length) {
      return {
        error: true,
        message: 'No resources found with the provided IDs',
      }
    }
    if (docs.some((doc) => doc.isSystemDefault)) {
      return {
        error: true,
        message: 'Some resources are system defaults and cannot be deleted',
      }
    }

    // 标记所有角色为已删除，只更新 isDeleted 字段，而不删除关联表中的记录，便于后面恢复
    const updatedDocs = docs.map((doc) => {
      return {
        ...doc,
        isDeleted: true,
      }
    })

    await this.resourceRepository.save(updatedDocs)

    return {
      message: `Successfully deleted ${updatedDocs.length} docs`,
      deletedCount: updatedDocs.length,
      deletedIds: updatedDocs.map((doc) => doc.id),
    }
  }
  /**
   * 批量更新
   */
  async batchUpdate(dtos: UpdateResourceDto[]) {
    if (!dtos || dtos.length === 0) {
      throw new HttpException('No resources to update', HttpStatus.BAD_REQUEST)
    }

    // 检查是否有重复的ID
    const ids = dtos.map((item) => item.id)
    const uniqueIds = new Set(ids)
    if (uniqueIds.size !== ids.length) {
      throw new HttpException('Batch contains duplicate resource IDs', HttpStatus.BAD_REQUEST)
    }

    // 查询所有要更新的资源
    const resources = await this.resourceRepository.findBy({ id: In(ids) })

    // 检查是否所有资源都存在
    if (resources.length !== dtos.length) {
      throw new HttpException('Some resources not found for the provided IDs', HttpStatus.NOT_FOUND)
    }

    // 更新资源
    const updatedResources = resources.map((resource) => {
      const dto = dtos.find((item) => item.id === resource.id)
      if (!dto) return resource // 如果没有找到对应的 DTO，则返回原始资源

      // 更新字段
      if (dto.code !== undefined) resource.code = dto.code
      if (dto.name !== undefined) resource.name = dto.name
      if (dto.type !== undefined) resource.type = dto.type
      if (dto.parentCode !== undefined) resource.parentCode = dto.parentCode
      if (dto.isDeleted !== undefined) resource.isDeleted = dto.isDeleted
      if (dto.isEnabled !== undefined) resource.isEnabled = dto.isEnabled
      if (dto.isSystemDefault !== undefined) resource.isSystemDefault = dto.isSystemDefault

      return resource
    })

    // 保存更新后的资源
    return this.resourceRepository.save(updatedResources)
  }

  /**
   * 批量更新（根据IDS来更新）
   */
  async batchUpdateByIds(dto: Omit<UpdateResourceDto, 'id'>, ids?: number[]) {
    let resources: Resource[]
    if (!ids || ids.length === 0) {
      // 如果没有提供ID，则查询所有资源
      resources = await this.resourceRepository.find()
    } else {
      // 查询所有要更新的资源
      resources = await this.resourceRepository.find({
        where: { id: In(ids) },
      })

      // 检查是否所有资源都存在
      if (resources.length !== ids.length) {
        throw new HttpException('Some resources not found for the provided IDs', HttpStatus.NOT_FOUND)
      }
    }

    // 更新资源
    const updatedResources = resources.map((resource) => {
      if (dto.code !== undefined) resource.code = dto.code
      if (dto.name !== undefined) resource.name = dto.name
      if (dto.type !== undefined) resource.type = dto.type
      if (dto.parentCode !== undefined) resource.parentCode = dto.parentCode
      if (dto.isDeleted !== undefined) resource.isDeleted = dto.isDeleted
      if (dto.isEnabled !== undefined) resource.isEnabled = dto.isEnabled
      if (dto.isSystemDefault !== undefined) resource.isSystemDefault = dto.isSystemDefault

      return resource
    })

    // 保存更新后的资源
    return this.resourceRepository.save(updatedResources)
  }

  /**
   * 查询全部resource
   * @returns Resource[]
   */
  async findAll(dto: FindAllDto = {}) {
    const { isDeleted = false, isEnabled } = dto
    let condition = {}
    if (isDeleted !== undefined) {
      condition = { isDeleted: Boolean(isDeleted) }
    }
    if (isEnabled !== undefined) {
      condition = { isEnabled: Boolean(isEnabled) }
    }
    return this.resourceRepository.find({
      where: condition,
    })
  }
  /**
   * 批量删除(硬删除)
   */
  async actualDeleteDocs(ids: number[]) {
    // 检查是否有重复的ID
    const uniqueIds = new Set(ids)
    if (uniqueIds.size !== ids.length) {
      return {
        error: true,
        message: 'Batch contains duplicate resource IDs',
      }
    }
    const docs = await this.resourceRepository.find({
      where: { id: In(ids) },
    })

    if (!docs.length) {
      return {
        error: true,
        message: 'No resources found with the provided IDs',
      }
    }
    // 检查是否所有资源都存在
    if (docs.length !== ids.length) {
      return {
        error: true,
        message: 'Some resources not found for the provided IDs',
      }
    }

    await this.resourceRepository.remove(docs)

    return {
      message: `Successfully deleted ${docs.length} docs`,
      deletedCount: docs.length,
      deletedIds: docs.map((doc) => doc.id),
      deletedCodes: docs.map((doc) => doc.code),
    }
  }
}
