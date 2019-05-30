import { Scheduler } from './../scheduler.class'
import { Flag } from './../flags'
import { InvalidFlagValueError } from './../errors'

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
   * Get flag by name
   */
  public getByName(name: string) {
    return this.container_flags.filter(e => e.getAllNames().indexOf(name) !== -1)
  }

  /**
   * Parse value
   */
  public static parseValue(flag_name: string, value: any, to_type: string, to_subtype?: string) {
    if(to_type == 'string') {
      if(typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') value = value.toString();
      else if(typeof value == 'object') value = JSON.stringify(value);
      else throw new InvalidFlagValueError(flag_name, to_type, typeof value);
    }

    else if(to_type == 'boolean') {
      if(typeof value == 'boolean') value = value;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'false' || value.trim() == '0')) value = false;
      else if(typeof value == 'string' && (value.trim().toLowerCase() == 'true' || value.trim() == '1')) value = true;
      else throw new InvalidFlagValueError(flag_name, to_type, typeof value);
    }

    else if(to_type == 'number') {
      if(typeof value == 'number') value = value;
      else if(typeof value == 'string' && value.length && !isNaN(Number(value))) value = Number(value);
      else throw new InvalidFlagValueError(flag_name, to_type, typeof value);
    }

    else if(to_type == 'object') {
      if(typeof value == 'object') value = value;
      else if(typeof value == 'string') {
        try {
          value = JSON.parse(value)
        }
        catch(err) {
          throw new InvalidFlagValueError(flag_name, to_type, typeof value);
        }
      }
      else throw new InvalidFlagValueError(flag_name, to_type, typeof value);
    }

    else if(to_type == 'array') {
      let arr: any[] = []

      if(typeof value == 'string') {
        arr.push(this.parseValue(flag_name, value, to_subtype))
      }
      else if(value instanceof Array) {
        for(let i in value) {
          arr.push(this.parseValue(flag_name, value[i], to_subtype))
        }
      }
      else throw new InvalidFlagValueError(flag_name, to_type, typeof value)

      value = arr
    }

    else {
      throw new Error(`The data type "${to_type}" is invalid for the "${flag_name}" flag.`)
    }

    return value
  }

}
