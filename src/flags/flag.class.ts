/*
 * Options
 * */
interface OptionsFlag {
  alias?: string | string[],
  description?: string,
  type?: 'string'|'boolean'|'number'|'array'|'object',
  subtype?: 'string'|'boolean'|'number'|'object', // no 'array'
  default?: any,
}

/*
 * Flag
 * */
export class Flag {

  public name: string | string[]
  public options: OptionsFlag = { }
  public value: any

  constructor(name: string, options: OptionsFlag = { }) {
    this.name = name
    this.options = options || { }
  }

  /**
   * Required
   */
  public isRequired(): boolean {
    return typeof this.options.default == 'undefined'
  }

}
