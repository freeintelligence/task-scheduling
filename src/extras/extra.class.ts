import { ExtraOptions } from './../interfaces'

/**
 * Extra
 */
export class Extra {

  /**
   * Data
   */
  private name: string
  private options: ExtraOptions
  public value: string

  /**
   * Constructor
   */
  constructor(name: string, options?: ExtraOptions) {
    this.options = options || { }
    this.options.default = typeof this.options.default != 'undefined' ? this.options.default : undefined
    this.name = name
  }

  /**
   * Required
   */
  public required(): boolean {
    return typeof this.options.default == 'undefined'
  }

  /**
   * Beauty name
   */
  public beautyName(): string {
    return `<${this.name}${!this.required() ? '?' : ''}>`
  }

}
