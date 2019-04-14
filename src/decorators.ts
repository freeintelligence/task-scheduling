import { ParameterDecorator } from 'ts-ext-decorators'
import { Flags as IFlags } from './types'

/*
 *
 * */
export interface Flags extends IFlags { }

/*
 * Flags data
 * */
export function Flags(flag?: string): Function {
  return function(target: Object, propertyKey: string, parameterIndex: number) {
    ParameterDecorator.create_prototype(target, propertyKey, parameterIndex, (data: any) => {
      return flag && data.flags ? data.flags[flag] : data.flags ? data.flags : null
    })
  }
}
