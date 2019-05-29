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

    if(typeof this.name == 'string') this.name = [ this.name ];
  }

  /**
   * Required
   */
  public isRequired(): boolean {
    return typeof this.options.default == 'undefined'
  }

  /**
   * Get default value
   */
  public getDefault() {
    return this.options.default
  }

  /**
   * Get names
   */
  public getNames(): string[] {
    return (<string[]>this.name).filter(e => e.length >= 2)
  }

  /**
   * Get main name
   */
  public getMainName(): string {
    const names = this.getNames()
    return names.length ? names[0] : null
  }

  /**
   * Get aliases
   */
  public getAliases(): string[] {
    return (<string[]>this.name).filter(e => e.length == 1)
  }

  /**
   * Get main alias
   */
  public getMainAlias(): string {
    const aliases = this.getAliases()
    return aliases.length ? aliases[0] : null
  }

  /**
   * Get first name (name or alias)
   */
  public getFirstName(): string {
    return this.getMainName() || this.getMainAlias()
  }

  /**
   * Beauty name (for print)
   */
  public beautyName(): string {
    let name = ''

    if(this.getMainAlias()) {
      name += name.length ? ' '+name : ''
      name += `-${this.getMainAlias()}`
    }
    if(this.getMainName() || !this.isRequired()) {
      name += (name.length ? ' '+name : '')+'['

      if(this.getMainName()) {
        name += `--${this.getMainName()}`
      }
      if(!this.isRequired()) {
        name += `=${this.getDefault()}`
      }

      name += ']'
    }

    return name
  }

}
