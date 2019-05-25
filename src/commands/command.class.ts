import { Extra } from './../extras'
import { Flag } from './../flags'

/*
 * Base command
 * */
export class BaseCommand {

  /**
   * Instance data
   */
  name?: string | string[]
  description?: string
  flags?: { [key: string]: Flag } | Flag[]
  extras?: { [key: string]: Extra }

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Run command
   */
  async run(...args: any[]) {

  }

  /**
   * Get main name
   */
  public mainName(): string {
    const names = <string[]>this.name
    return names.length ? names[0] : null
  }

  /**
   * Get complete command name (with extras)
   */
  public completeName(): string {
    let name = this.mainName()
    
    if(!name) return '';

    this.extrasLikeArray().forEach(extra => {
      name = `${name} ${extra.beautyName()}`
    })

    return name
  }

  /**
   * Get flags like object
   */
  public flagsLikeObject(): { [key: string]: Flag } {
    if(this.flags instanceof Array) {
      const flags: { [key: string]: Flag } = { }

      for(let i in this.flags) {
        const flag = this.flags[i]
        const name = flag.mainName() || flag.mainAlias()

        flags[name] = flag
      }

      return flags
    }
    else {
      if(typeof this.flags == 'undefined' || this.flags == null) {
        return { }
      }
      else {
        return this.flags
      }
    }
  }

  /**
   * Get flags like array
   */
  public flagsLikeArray(): Flag[] {
    if(this.flags instanceof Array) {
      return this.flags
    }
    else {
      if(typeof this.flags == 'undefined' || this.flags == null) {
        return []
      }
      else {
        return Object.values(this.flags)
      }
    }
  }

  /**
   * Get extras like object
   */
  public extrasLikeObject(): { [key: string]: Extra } {
    if(typeof this.extras == 'undefined' || this.extras == null) {
      return { }
    }
    else {
      return this.extras
    }
  }

  /**
   * Get extras like array
   */
  public extrasLikeArray(): Extra[] {
    return Object.values(this.extrasLikeObject())
  }

}
