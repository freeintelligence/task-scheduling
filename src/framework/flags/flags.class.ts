import { Flag } from './../flags'
import { InvalidFlagValueError } from './../errors'
import { Resource } from'./../inspector'

/*
 * Flags instance (global flags)
 * */
export class Flags {

  /*
   * Data
   * */
  private container_flags: Flag[] = []

  /*
   * Constructor
   * */
  constructor() {
  }

  /*
   * Reset
   * */
  public reset() {
    this.container_flags = []

    return this
  }

  /**
   * Remove flags by name
   */
  public remove(name: string|string[]) {
    if(typeof name == 'string') name = [ name ];

    for(let i in name) {
      this.container_flags = this.container_flags.filter(e => e.getAllNames().indexOf(name[i]) === -1)
    }
  }

  /**
   * Register flag
   */
  public push(instance: Flag) {
    this.container_flags.push(instance)
    return this
  }

  /**
   * Flag exists
   */
  public exists(name: string) {
    return this.getByName(name).length
  }

  /**
   * Get all flags
   */
  public getAll() {
    return this.container_flags
  }

  /**
   * Get all flags like object
   */
  public getAllLikeObject(): { [key: string]: Flag } {
    const flags: { [key: string]: Flag } = { }

    for(let flag of this.container_flags) {
      const name = flag.getFirstName()

      flags[name] = flag
    }

    return flags
  }

  /**
   * Get flag by name
   */
  public getByName(name: string) {
    return this.container_flags.filter(e => e.getAllNames().indexOf(name) !== -1)
  }

  /**
   * Parse value
   */
  public static parseValue(flag: Flag, value: any, to_type: string, to_subtype?: string, parenttype?: string) {
    if(to_type == 'string') {
      if(typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') value = value.toString();
      else if(typeof value == 'object') value = JSON.stringify(value);
      else throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype));
    }

    else if(to_type == 'boolean') {
      if(typeof value == 'boolean') value = value;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'false' || value.trim() == '0')) value = false;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'true' || value.trim() == '1' || value.trim() == '')) value = true;
      else throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype));
    }

    else if(to_type == 'number') {
      if(typeof value == 'number') value = value;
      else if(typeof value == 'string' && value.length && !isNaN(Number(value))) value = Number(value);
      else throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype));
    }

    else if(to_type == 'object') {
      if(typeof value == 'object') value = value;
      else if(typeof value == 'string') {
        try {
          value = JSON.parse(value)
        }
        catch(err) {
          throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype));
        }
      }
      else throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype));
    }

    else if(to_type == 'array') {
      let arr: any[] = []

      if(typeof value == 'string') {
        arr.push(this.parseValue(flag, value, to_subtype, undefined, parenttype))
      }
      else if(value instanceof Array) {
        for(let i in value) {
          arr.push(this.parseValue(flag, value[i], to_subtype, undefined, parenttype))
        }
      }
      else throw new InvalidFlagValueError(flag, this.flagWithParent(to_type, parenttype), this.flagWithParent(typeof value, parenttype))

      value = arr
    }

    else {
      throw new Error(`The data type "${to_type}" is invalid for the "${flag.beautyName()}" flag.`)
    }

    return value
  }

  /**
   * Set flag values by resources (Inspector instance data)
   */
  public static setValuesByResources(flags: Flag[], resources: Resource[], values_array: Resource[]) {
    for(let flag of flags) {
      if(flag.options.type !== 'array') {
        const resource_flag = resources.find(e => (!e.used && e.type == 'flag' && flag.getNames().indexOf(e.name) !== -1) || (!e.used && e.type == 'flag-alias' && flag.getAliases().indexOf(e.name) !== -1))

        if(!resource_flag && flag.isRequired()) {
          return flag
        }

        flag.value = resource_flag && typeof resource_flag.value !== 'undefined' ? resource_flag.value : flag.getDefault()

        if(resource_flag) {
          resource_flag.used = true
        }
      }
      else {
        const resource_flag = resources.find(e => (!e.used && e.type == 'flag' && flag.getNames().indexOf(e.name) !== -1) || (!e.used && e.type == 'flag-alias' && flag.getAliases().indexOf(e.name) !== -1))

        if(!resource_flag && flag.isRequired()) {
          return flag
        }
        else if(!resource_flag && !flag.isRequired()) {
          flag.value = flag.getDefault()
        }
        else {
          const resource_values = values_array.filter(e => !e.used && e.index >= resource_flag.index)
          const arr: any[] = []

          if(!resource_values.length && flag.isRequired()) {
            return flag
          }

          if(typeof resource_flag.value !== 'undefined' && typeof resource_flag.value != 'string' || (typeof resource_flag.value == 'string' && resource_flag.value.length)) {
            resource_flag.used = true
            arr.push(resource_flag.value)
          }

          resource_values.forEach(resource => {
            arr.push(resource.value)
            resource.used = true
          })

          flag.value = arr
          resource_flag.used = true
        }
      }
    }

    return true
  }

  /**
   * Generate string value: flag type with parent type
   */
  public static flagWithParent(flag: string, parent?: string): string {
    if(typeof parent == 'string' && parent.length) {
      return `${parent}<${flag}>`
    }

    return flag
  }

}
