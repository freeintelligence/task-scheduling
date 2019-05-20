/*
 * Options
 * */
interface OptionsFlag {
  description?: string,
  alias?: string,
  type?: 'string'|'boolean'|'number'|'array'|'object',
  subtype?: 'string'|'boolean'|'number'|'object', // no 'array'
  default?: any, // If it is "undefined" then the "flag" will be required
}

/*
 * Flag
 * */
export class Flag {

  public name: string
  public options: OptionsFlag = {}
  public value: any

  constructor(name: string, options: OptionsFlag = {}) {
    this.name = name
    this.options.description = typeof options.description == 'string' ? options.description : ''
    this.options.alias = typeof options.alias == 'string' ? options.alias : undefined
    this.options.type = typeof options.type == 'string' ? options.type : 'string'
    this.options.default = this.options.type == 'array' ? (typeof options.default !== 'undefined' && options.default instanceof Array ? options.default : (typeof options.default !== 'undefined' ? [options.default] : [])) : options.default
    this.options.subtype = options.subtype
  }

  isRequired(): boolean {
    return typeof this.options.default == 'undefined'
  }

}
