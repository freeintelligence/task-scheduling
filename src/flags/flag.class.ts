import { InvalidFlagValueError } from './../errors'

/*
 * Options
 * */
interface OptionsFlag {
  alias?: string | string[],
  description?: string,
  type: 'string'|'boolean'|'number'|'array'|'object',
  subtype?: 'string'|'boolean'|'number'|'object', // no 'array'
  default?: any,
}

/*
 * Flag
 * */
export class Flag {

  /**
   * Instance data
   */
  protected name: string | string[]
  protected options: OptionsFlag
  protected internal_value: any

  constructor(name: string, options: OptionsFlag) {
    this.name = name
    this.options = options || { type: 'string' }
  }

  /**
   * Set value
   */
  set value(value: any) {
    if(this.options.type == 'string') {
      if(typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') value = value.toString();
      else if(typeof value == 'object') value = JSON.stringify(value);
      else throw new InvalidFlagValueError(this.getFirstName(), this.options.type, typeof value);
    }

    else if(this.options.type == 'boolean') {
      if(typeof value == 'boolean') value = value;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'false' || value.trim() == '0')) value = false;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'true' || value.trim() == '1')) value = true;
      else throw new InvalidFlagValueError(this.getFirstName(), this.options.type, typeof value);
    }

    else if(this.options.type == 'number') {
      if(typeof value == 'number') value = value;
      else if(typeof value == 'string' && value.length && !isNaN(Number(value))) value = Number(value);
      else throw new InvalidFlagValueError(this.getFirstName(), this.options.type, typeof value);
    }

    else if(this.options.type == 'object') {
      if(typeof value == 'object') value = value;
      else if(typeof value == 'string') {
        try {
          value = JSON.parse(value)
        }
        catch(err) {
          throw new InvalidFlagValueError(this.getFirstName(), this.options.type, typeof value);
        }
      }
      else throw new InvalidFlagValueError(this.getFirstName(), this.options.type, typeof value);
    }

    this.internal_value = value
  }

  /**
   * Get value
   */
  get value(): any {
    return this.internal_value
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
   * Get description
   */
  public getDescription(): string {
    return typeof this.options.description == 'string' && this.options.description.length ? this.options.description : null
  }

  /**
   * Get all names (names and aliases)
   */
  public getAllNames(): string[] {
    let names: string[] = []

    if(typeof this.name == 'string' && this.name.length) {
      names.push(this.name)
    }
    else if(this.name instanceof Array) {
      names = names.concat(this.name)
    }
    if(typeof this.options.alias == 'string' && this.options.alias.length) {
      names.push(this.options.alias)
    }
    else if(this.options.alias instanceof Array) {
      names = names.concat(this.options.alias)
    }

    return names
  }

  /**
   * Get names (only names, not aliases)
   */
  public getNames(): string[] {
    return this.getAllNames().filter(e => e.length >= 2)
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
    return this.getAllNames().filter(e => e.length == 1)
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
      name = name.length ? ' '+name : ''
      name += `-${this.getMainAlias()}`
    }
    if(this.getMainName() || !this.isRequired()) {
      name = (name.length ? name+' ' : '')+'['

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
