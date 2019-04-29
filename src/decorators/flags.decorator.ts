import { ParameterDecorator } from 'ts-ext-decorators'
import { Flags as IFlags } from './../interfaces'
import { Flag } from './../flag'

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
      const result: Flag = flag && data.flags ? data.flags[flag] : (data.flags ? data.flags : null)

      return result == null ? undefined : (flag ? result.value : result)
    })
  }
}
