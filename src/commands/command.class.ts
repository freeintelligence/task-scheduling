import { BaseMiddletask } from './../middletasks'
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
  protected middletasks?: typeof BaseMiddletask[]
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
        const name = flag.getFirstName()

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
    let extras: { [key: string]: Extra } = { }
    let not_required: boolean = false

    if(typeof this.name == 'string' && this.name.length && !(this.extras instanceof Object)) {
      const data = Extras.extrasByName(this.name)

      extras = data.extras
    }
    else if(!(this.extras instanceof Object)) {
      extras = { }
    }
    else {
      extras = this.extras
    }

    for(let i in extras) {
      const extra = extras[i]

      if(!extra.isRequired() || not_required) {
        not_required = true

        if(!extra.getDefault()) {
          extra.setDefault('')
        }
      }
    }

    return extras
  }

  /**
   * Get extras like array
   */
  public getExtrasLikeArray(): Extra[] {
    return Object.values(this.getExtrasLikeObject())
  }

  /**
   * Get middletasks like object
   */
  public getMiddletasksLikeArray(): typeof BaseMiddletask[] {
    return this.middletasks instanceof Array ? this.middletasks : []
  }

  /**
   * Add temporal flag
   */
  public addTemporalFlag(flag: Flag) {
    flag.options.temporal = true

    if(this.flags instanceof Array) {
      this.flags.push(flag)
    }
    else if(this.flags instanceof Object) {
      this.flags[flag.getFirstName()] = flag
    }
    else {
      this.flags = { }

      this.flags[flag.getFirstName()] = flag
    }
  }

  /**
   * Remove temporal flags
   */
  public removeTemporalFlags() {
    if(this.flags instanceof Array) {
      this.flags = this.flags.filter(e => !e.options.temporal)
    }
    else if(this.flags instanceof Object) {
      for(let i in this.flags) {
        if(this.flags[i].options.temporal) {
          delete this.flags[i]
        }
      }
    }
    else {
      this.flags = { }
    }
  }

  /**
   * Add temporal extra
   */
  public addTemporalExtra(extra: Extra) {
    extra.options.temporal = true

    if(!this.extras) {
      this.extras = { }
    }
    if(this.extras instanceof Object) {
      this.extras[extra.getName()] = extra
    }
  }

  /**
   * Remove temporal extras
   */
  public removeTemporalExtras() {
    if(this.extras instanceof Object) {
      for(let i in this.extras) {
        if(this.extras[i].options.temporal) {
          delete this.extras[i]
        }
      }
    }
  }

  /**
   * Fix instance
   */
  public fix() {
    this.extras = this.getExtrasLikeObject()

    return this
  }

}
