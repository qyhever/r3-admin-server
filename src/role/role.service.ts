import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not } from 'typeorm'
import { Resource } from '@/resource/resource.entity'
import { Role } from './role.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleFindListDto } from './dto/find-list.dto'
import { RoleResource } from '@/common/role-resource.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(RoleResource) private roleResourceRepository: Repository<RoleResource>,
  ) {}

  /**
   * Create a new role
   */
  async createDoc(dto: CreateRoleDto) {
    const { name, code, description, resourceCodes, isEnabled, isSystemDefault = false } = dto

    // Check if role with same code already exists
    const existingRole = await this.roleRepository.findOne({ where: { code } })
    if (existingRole) {
      return {
        error: true,
        message: 'code编码已存在',
      }
    }

    const newRole = new Role()
    newRole.name = name
    newRole.code = code
    newRole.isEnabled = isEnabled
    newRole.description = description || ''
    newRole.isSystemDefault = isSystemDefault
    // 1. 先保存 Role（没有关联关系）
    const savedRole = await this.roleRepository.save(newRole)
    // 2. 如果有传 resourceCodes，创建关联关系
    if (resourceCodes?.length) {
      const resourceList = await this.resourceRepository.find({
        where: {
          code: In(resourceCodes),
        },
      })
      // 3. 根据 savedRole 创建 RoleResource 实例
      const roleResources = resourceList.map((resource) => {
        const roleResource = new RoleResource()
        roleResource.role = savedRole
        roleResource.resource = resource
        return roleResource
      })

      // 4. 直接保存 RoleResource 实例
      await this.roleRepository.manager.save(roleResources)

      // 5. 返回具有更新关系的 role
      return this.roleRepository.findOne({
        where: { id: savedRole.id },
        relations: ['roleResources', 'roleResources.resource'],
      })
    }

    return savedRole
  }

  /**
   * Update role information
   */
  async updateDoc(dto: UpdateRoleDto) {
    const { id, name, code, description, resourceCodes, isDeleted, isEnabled, isSystemDefault } = dto

    // Find the role to update
    const existingRole = await this.roleRepository.findOne({ where: { id } })
    if (!existingRole) {
      return {
        error: true,
        message: 'Doc not found',
      }
    }

    if (existingRole.isSystemDefault) {
      return {
        error: true,
        message: '系统内置资源不能修改',
      }
    }
    if (code) {
      // Check if role with same code already exists
      const existingSameCodeRole = await this.roleRepository.findOne({ where: { code, id: Not(id) } })
      if (existingSameCodeRole) {
        return {
          error: true,
          message: 'code编码已存在',
        }
      }
    }
    if (name) {
      // Check if role with same name already exists
      const existingSameNameRole = await this.roleRepository.findOne({ where: { name, id: Not(id) } })
      if (existingSameNameRole) {
        return {
          error: true,
          message: '角色名已存在',
        }
      }
    }

    // Update fields if provided
    if (name !== undefined) existingRole.name = name
    if (code !== undefined) existingRole.code = code
    if (description !== undefined) existingRole.description = description
    if (isDeleted !== undefined) existingRole.isDeleted = isDeleted
    if (isEnabled !== undefined) existingRole.isEnabled = isEnabled
    if (isSystemDefault !== undefined) existingRole.isSystemDefault = isSystemDefault
    await this.roleRepository.save(existingRole)
    if (resourceCodes) {
      if (existingRole.roleResources?.length) {
        await this.roleResourceRepository.remove(existingRole.roleResources)
      }

      const resourceList = await this.resourceRepository.find({
        where: {
          code: In(resourceCodes),
        },
      })

      const roleResources = resourceList.map((resource) => {
        const roleResource = new RoleResource()
        roleResource.role = existingRole
        roleResource.resource = resource
        return roleResource
      })
      await this.roleResourceRepository.save(roleResources)
    }

    return this.roleRepository.findOne({
      where: { id },
      relations: ['roleResources', 'roleResources.resource'],
    })
  }

  /**
   * Paginated role list
   */
  /**
   * 分页查询角色
   * - 使用 RoleFindListDto 作为查询参数类型
   */
  async findList(dto: RoleFindListDto) {
    const { currentPage = 1, pageSize = 10, name, code, rangeDate } = dto
    const skip = (currentPage - 1) * pageSize

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.roleResources', 'roleResource')
      .leftJoinAndSelect('roleResource.resource', 'resource', 'resource.isEnabled = :resourceEnabled', {
        resourceEnabled: true,
      })
      // 添加条件过滤已删除的资源
      .andWhere('role.isDeleted = :isDeleted', {
        isDeleted: false,
      })

    // Add search conditions
    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` })
    }
    if (code) {
      queryBuilder.andWhere('role.code LIKE :code', { code: `%${code}%` })
    }
    if (rangeDate && rangeDate.length === 2) {
      const [start, end] = rangeDate
      queryBuilder.andWhere('role.createdAt BETWEEN :start AND :end', { start, end })
    }

    // 选择特定字段，排除不需要的字段
    // queryBuilder.select([
    //   // 'role.id',
    //   // 'role.code',
    //   // 'role.name',
    //   // 'role.description',
    //   // 'role.isEnabled',
    //   // 'role.createdAt',
    //   // 'role.updatedAt',
    //   'role',
    //   'roleResource',
    //   'resource.id',
    //   'resource.code',
    //   'resource.name',
    //   'resource.type',
    //   'resource.parentCode',
    //   'resource.isEnabled',
    // ])

    if (dto.sortField && dto.sortValue) {
      // 使用传入的排序字段和排序方式
      queryBuilder.orderBy(`role.${dto.sortField}`, dto.sortValue === 'asc' ? 'ASC' : 'DESC')
    } else {
      // 默认排序方式
      queryBuilder.orderBy('role.createdAt', 'DESC')
    }

    const [roles, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount()

    // 处理结果
    const processedRoles = roles.map((role) => {
      const { roleResources, ...roleBasicInfo } = role

      // 获取有效的权限
      const validResources = roleResources
        .filter((rr) => rr.resource && !rr.resource.isDeleted && rr.resource.isEnabled)
        .map((roleResource) => ({
          id: roleResource.resource.id,
          code: roleResource.resource.code,
          name: roleResource.resource.name,
        }))
      const roleInstance = Object.assign(new Role(), roleBasicInfo)

      return {
        ...roleInstance,
        createdAt: roleInstance.createdAtFormatted,
        updatedAt: roleInstance.updatedAtFormatted,
        resources: validResources,
      }
    })

    return { list: processedRoles, total }
  }

  /**
   * 查询全部
   */
  async findAll() {
    return this.roleRepository.find({
      where: {
        isDeleted: false,
        isEnabled: true,
      },
    })
  }

  /**
   * Get role details by ID
   * @param id - Role ID
   * @returns Role with associated resources
   */
  async findDoc(id: number) {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.roleResources', 'roleResource')
      .leftJoinAndSelect('roleResource.resource', 'resource', 'resource.isEnabled = :resourceEnabled', {
        resourceEnabled: true,
      })
      .where('role.id = :id', { id })
      .andWhere('role.isDeleted = :isDeleted', { isDeleted: false })
      .getOne()

    if (!role) {
      return {
        error: true,
        message: 'Doc not found',
      }
    }

    const { roleResources, ...roleBasicInfo } = role
    const roleInstance = Object.assign(new Role(), roleBasicInfo)
    const resources = roleResources
      .filter((rr) => rr.resource && !rr.resource.isDeleted && rr.resource.isEnabled)
      .map((rr) => {
        return rr.resource
      })

    return {
      ...roleBasicInfo,
      createdAt: roleInstance.createdAtFormatted,
      updatedAt: roleInstance.updatedAtFormatted,
      resources,
    }
  }

  /**
   * Delete a role
   */
  async deleteDoc(id: number) {
    // 检查资源是否存在
    const doc = await this.roleRepository.findOne({
      where: { id },
      relations: ['roleResources'],
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
    // 硬删除关联关系
    const pros = doc.roleResources.map((roleResource) => {
      return this.roleResourceRepository.remove(roleResource)
    })
    await Promise.all(pros)
    // 软删除
    doc.isDeleted = true
    await this.roleRepository.save(doc)
    return doc
  }
  /**
   * Delete roles
   */
  async deleteDocs(ids: number[]) {
    // 检查角色是否存在，并加载关联关系
    const roles = await this.roleRepository.find({
      where: { id: In(ids) },
      relations: ['roleResources'],
    })

    if (!roles.length) {
      return {
        error: true,
        message: 'No roles found with the provided IDs',
      }
    }

    if (roles.some((role) => role.isSystemDefault)) {
      return {
        error: true,
        message: 'Some roles are system defaults and cannot be deleted',
      }
    }

    // 硬删除所有关联关系
    const deletePromises: Promise<RoleResource>[] = []
    roles.forEach((role) => {
      if (role.roleResources) {
        role.roleResources.forEach((roleResource) => {
          deletePromises.push(this.roleResourceRepository.remove(roleResource))
        })
      }
    })
    await Promise.all(deletePromises)

    // 软删除
    const updatedRoles = roles.map((role) => {
      return {
        ...role,
        isDeleted: true,
      }
    })
    await this.roleRepository.save(updatedRoles)

    return {
      message: `Successfully deleted ${updatedRoles.length} roles`,
      deletedCount: updatedRoles.length,
      deletedIds: updatedRoles.map((role) => role.id),
    }
  }

  async toggleStatus(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    })
    if (!role) {
      return {
        error: true,
        message: 'Role not found',
      }
    }
    role.isEnabled = !role.isEnabled
    await this.roleRepository.save(role)
    return null
  }
}
