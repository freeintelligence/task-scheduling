import { ParameterDecorator } from 'ts-ext-decorators'

/*
 *
 * */
export interface Extra {
  [key: string]: string
}

/*
 * Extra data
 * */
export function Extra(key?: string): Function {
  return function(target: Object, propertyKey: string, parameterIndex: number) {
    ParameterDecorator.create_prototype(target, propertyKey, parameterIndex, (data: any) => {
      return typeof key == 'string' && key.length ? data.extra[key] : data.extra
    })
  }
}
