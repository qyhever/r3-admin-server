import { Injectable } from '@nestjs/common' // 导入 Injectable 装饰器，用于标记服务类
import { InjectRepository } from '@nestjs/typeorm' // 用于注入 TypeORM 仓库
import { Repository, In } from 'typeorm' // 导入 TypeORM 的 Repository 类
// import * as dayjs from 'dayjs'
import { User } from './user.entity' // 导入用户实体
import { Role } from '@/role/role.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserFindListDto } from './dto/find-list.dto'
import { UserRole } from '../common/user-role.entity'
import { Util } from '@/utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
  ) {}

  async createDoc(dto: CreateUserDto) {
    try {
      const { avatar, username, mobile, password, isEnabled, roleCodes } = dto
      let doc: User | null = null
      doc = await this.userRepository.findOne({
        where: { username },
      })
      if (doc) {
        return {
          error: true,
          message: '用户名已存在',
        }
      }
      doc = await this.userRepository.findOne({
        where: { mobile },
      })
      if (doc) {
        return {
          error: true,
          message: '手机号已存在',
        }
      }
      const newUser = new User()
      newUser.avatar = avatar
      newUser.username = username
      newUser.mobile = mobile
      newUser.isEnabled = isEnabled
      newUser.password = await Util.genHashPassword(password)
      // 1. First save the user without relationships
      const savedUser = await this.userRepository.save(newUser)
      // 2. If there are roles to assign, create the relationships
      if (roleCodes?.length) {
        const roleList = await this.roleRepository.find({
          where: {
            code: In(roleCodes),
          },
        })

        // 3. Create UserRole instances with the saved user
        const userRoles = roleList.map((role) => {
          const userRole = new UserRole()
          userRole.user = savedUser
          userRole.role = role
          return userRole
        })

        // 4. Save the UserRole entities directly
        await this.userRepository.manager.save(userRoles)

        // 5. Return the user with updated relationships
        return this.userRepository.findOne({
          where: { id: savedUser.id },
          relations: ['userRoles', 'userRoles.role'],
        })
      }
      return savedUser
    } catch (error) {
      console.log('error', error)
    }
  }
  async updateDoc(dto: UpdateUserDto) {
    try {
      const { id, avatar, username, mobile, password, roleCodes, isDeleted, isEnabled, isSystemDefault } = dto
      // 1. 查找要更新的用户
      const existingUser = await this.userRepository.findOne({
        where: { id },
        relations: ['userRoles'],
      })
      if (!existingUser) {
        return {
          error: true,
          message: 'Doc not found',
        }
      }

      if (existingUser.isSystemDefault) {
        return {
          error: true,
          message: '系统内置资源不能修改',
        }
      }
      // 2. 如果提供了新用户名，检查是否与其他用户冲突
      if (username && username !== existingUser.username) {
        const userWithSameName = await this.userRepository.findOne({
          where: { username },
        })
        if (userWithSameName && userWithSameName.id !== id) {
          return {
            error: true,
            message: '用户名已存在',
          }
        }
        existingUser.username = username
      }
      if (mobile && mobile !== existingUser.mobile) {
        const userWithSameMobile = await this.userRepository.findOne({
          where: { mobile },
        })
        if (userWithSameMobile && userWithSameMobile.id !== id) {
          return {
            error: true,
            message: '手机号已存在',
          }
        }
        existingUser.mobile = mobile
      }
      // 3. 更新基本信息
      if (avatar !== undefined) existingUser.avatar = avatar
      // 实体类已处理密码加密，所以这里直接赋值，不需要再进行加密操作
      if (password) existingUser.password = await Util.genHashPassword(password)
      if (isDeleted !== undefined) existingUser.isDeleted = isDeleted
      if (isEnabled !== undefined) existingUser.isEnabled = isEnabled
      if (isSystemDefault !== undefined) existingUser.isSystemDefault = isSystemDefault
      // 4. 保存用户基本信息
      await this.userRepository.save(existingUser)
      // 5. 如果提供了角色ID，更新用户角色关系
      if (roleCodes?.length !== undefined) {
        // 5.1 删除现有的用户角色关系
        if (existingUser.userRoles?.length) {
          await this.userRoleRepository.remove(existingUser.userRoles)
        }
        // 5.2 查找新的角色
        const roleList = await this.roleRepository.find({
          where: {
            code: In(roleCodes),
          },
        })
        // 5.3 创建新的用户角色关系
        const userRoles = roleList.map((role) => {
          const userRole = new UserRole()
          userRole.user = existingUser
          userRole.role = role
          return userRole
        })
        // 5.4 保存新的用户角色关系
        await this.userRoleRepository.save(userRoles)
      }
      // 6. 返回更新后的用户（包含关联关系）
      return this.userRepository.findOne({
        where: { id },
        relations: ['userRoles', 'userRoles.role'],
      })
    } catch (error) {
      console.log('update error', error)
      return {
        error: true,
        message: '更新用户失败',
        details: error instanceof Error ? error.message : String(error),
      }
    }
  }
  /**
   * 分页查询
   */
  /**
   * 分页查询用户
   * - 使用 UserFindListDto 作为查询参数类型
   */
  async findList(dto: UserFindListDto) {
    const { currentPage = 1, pageSize = 10, username, mobile, rangeDate } = dto
    const skip = (currentPage - 1) * pageSize

    // 简化查询，首先只查询用户和角色
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })

    // 添加搜索条件
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` })
    }
    if (mobile) {
      queryBuilder.andWhere('user.mobile LIKE :mobile', { mobile: `%${mobile}%` })
    }
    if (rangeDate && rangeDate.length === 2) {
      const [start, end] = rangeDate
      queryBuilder.andWhere('user.createdAt BETWEEN :start AND :end', { start, end })
    }

    // 排序
    if (dto.sortField && dto.sortValue) {
      queryBuilder.orderBy(`user.${dto.sortField}`, dto.sortValue === 'asc' ? 'ASC' : 'DESC')
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC')
    }

    const [users, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount()

    // 处理结果
    const processedUsers = users.map((user) => {
      const { userRoles, ...userBasicInfo } = user
      const userInstance = Object.assign(new User(), userBasicInfo)

      // 获取有效的角色
      const validRoles = userRoles
        .filter((ur) => ur.role && !ur.role.isDeleted && ur.role.isEnabled)
        .map((userRole) => ({
          id: userRole.role.id,
          code: userRole.role.code,
          name: userRole.role.name,
        }))

      return {
        ...userBasicInfo,
        createdAt: userInstance.createdAtFormatted,
        updatedAt: userInstance.updatedAtFormatted,
        roles: validRoles,
      }
    })

    return {
      list: processedUsers,
      total,
      currentPage,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  /**
   * 根据 ID 查询用户
   * @param id 用户 ID
   * @returns 匹配的用户对象或 null
   */
  async findDoc(id: number) {
    const user: User | null = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :id', { id })
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
      .getOne()

    if (!user) {
      return {
        error: true,
        message: 'Doc not found',
      }
    }

    const { userRoles, ...userBasicInfo } = user
    const userInstance = Object.assign(new User(), userBasicInfo)

    // 获取有效的角色
    const validRoles = userRoles
      .filter((ur) => ur.role && !ur.role.isDeleted && ur.role.isEnabled)
      .map((userRole) => ({
        id: userRole.role.id,
        code: userRole.role.code,
        name: userRole.role.name,
      }))

    // 查询用户的资源信息
    const userResources = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userRoles', 'userRole')
      .innerJoin('userRole.role', 'role')
      .innerJoin('role.roleResources', 'rr', 'rr.roleId = role.id')
      .innerJoin('resource', 'res', 'res.id = rr.resourceId')
      .where('user.id = :userId', { userId: id })
      .andWhere('role.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('role.isEnabled = :isEnabled', { isEnabled: true })
      .andWhere('res.isDeleted = :resDeleted', { resDeleted: false })
      .andWhere('res.isEnabled = :resEnabled', { resEnabled: true })
      .select([
        'res.id as id',
        'res.code as code',
        'res.name as name',
        'res.type as type',
        'res.parentCode as parentCode',
      ])
      .getRawMany()

    // 资源数据去重（同一资源可能通过多个角色获得）
    const resourceMap = new Map()

    userResources.forEach((resource: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      resourceMap.set(String(resource.id), resource)
    })
    const uniqueResources = Array.from(resourceMap.values())

    const doc = {
      ...userBasicInfo,
      createdAt: userInstance.createdAtFormatted,
      updatedAt: userInstance.updatedAtFormatted,
      roles: validRoles,
      resources: uniqueResources,
    }

    return doc
  }

  async deleteDoc(id: number) {
    const doc = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles'],
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

    // 硬删除所有关联关系
    const deletePromises: Promise<UserRole>[] = []
    doc.userRoles.forEach((userRole) => {
      deletePromises.push(this.userRoleRepository.remove(userRole))
    })
    await Promise.all(deletePromises)
    // 软删除
    doc.isDeleted = true
    await this.userRepository.save(doc)
    return doc
  }
  async deleteDocs(ids: number[]) {
    const docs = await this.userRepository.find({
      where: { id: In(ids) },
      relations: ['userRoles'],
    })
    if (!docs || docs.length === 0) {
      return {
        error: true,
        message: 'No users found with the provided IDs',
      }
    }
    const systemDefaultUsers = docs.filter((doc) => doc.isSystemDefault)
    if (systemDefaultUsers.length > 0) {
      return {
        error: true,
        message: 'Cannot delete system default users',
        systemDefaultUsers: systemDefaultUsers.map((user) => user.username),
      }
    }

    // 硬删除所有关联关系
    const deletePromises: Promise<UserRole>[] = []
    docs.forEach((user) => {
      if (user.userRoles) {
        user.userRoles.forEach((userRole) => {
          deletePromises.push(this.userRoleRepository.remove(userRole))
        })
      }
    })
    await Promise.all(deletePromises)

    // 软删除
    const updatedUsers = docs.map((user) => {
      return {
        ...user,
        isDeleted: true,
      }
    })
    await this.userRepository.save(updatedUsers)

    return {
      message: `Successfully deleted ${updatedUsers.length} users`,
      deletedCount: updatedUsers.length,
      deletedIds: updatedUsers.map((o) => o.id),
    }
  }
}
