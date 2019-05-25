import { Extra, Extras } from './../extras'
import { Flag } from './../flags'

/*
 * Base command
 * */
export class BaseCommand {

  /**
   * Instance data
   */
  protected name?: string | string[]
  protected description?: string
  protected flags?: { [key: string]: Flag } | Flag[]
  protected extras?: { [key: string]: Extra }

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
   * Get names
   */
  public getNames(): string[] {
    if(typeof this.name == 'string' && this.name.length) {
      const extras = Extras.extrasByName(this.name)

      return [ extras.name ]
    }
    else if(typeof this.name == 'undefined' || (typeof this.name == 'string' && !this.name.length)) {
      return [ ]
    }
    else if(this.name instanceof Array) {
      return this.name
    }

    return [ ]
  }

  /**
   * Get description
   */
  public getDescription(): string {
    if(typeof this.description == 'string' && this.description.length) {
      return this.description
    }

    return null
  }

  /**
   * Get main name
   */
  public getMainName(): string {
    const names = this.getNames()
    return names.length ? names[0] : null
  }

  /**
   * Get complete command name (with extras)
   */
  public getCompleteName(): string {
    let name = this.getMainName()
    
    if(!name) return '';

    this.getExtrasLikeArray().forEach(extra => {
      name = `${name} ${extra.beautyName()}`
    })

    return name
  }

  /**
   * Get flags like object
   */
  public getFlagsLikeObject(): { [key: string]: Flag } {
    if(this.flags instanceof Array) {
      const flags: { [key: string]: Flag } = { }

      for(let i in this.flags) {
        const flag = this.flags[i]
        const name = flag.mainName() || flag.mainAlias()

        flags[name] = flag
      }

      return flags
    }
    else if(!(this.flags instanceof Object)) {
      return { }
    }

    return this.flags
  }

  /**
   * Get flags like array
   */
  public getFlagsLikeArray(): Flag[] {
    return Object.values(this.getFlagsLikeObject())
  }

  /**
   * Get extras like object
   */
  public getExtrasLikeObject(): { [key: string]: Extra } {
    if(!(this.extras instanceof Object)) {
      return { }
    }

    return this.extras
  }

  /**
   * Get extras like array
   */
  public getExtrasLikeArray(): Extra[] {
    return Object.values(this.getExtrasLikeObject())
  }

}
