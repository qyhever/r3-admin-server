import { IsNotEmpty, IsArray, IsOptional } from 'class-validator'
import { UpdateResourceDto } from './update-resource.dto'
// { ids, row }: { ids?: number[]; row: Omit<UpdateResourceDto, 'id'>

export class BatchUpdateRowsByIdsDto {
  @IsArray({ each: true, message: 'ids必须是number[]' })
  @IsOptional()
  ids?: number[]

  @IsNotEmpty({ message: 'row不可为空' })
  row: Omit<UpdateResourceDto, 'id'>
}
