/*
 * Options
 * */
interface OptionsFlag {
  alias?: string,
  type?: any,
  subtype?: any,
  default?: any, // If it is "undefined" then the "flag" will be required
  multiple?: boolean,
}

/*
 * Flag
 * */
export class Flag {

  public name: string
  public options: OptionsFlag
  public value: any

  constructor(name: string, options: OptionsFlag = {}) {
    this.name = name
    this.options = options
  }

  isRequired(): boolean {
    return typeof this.options.default == 'undefined'
  }

}
