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
   * Get default
   */
  public getDefault(): string {
    return this.options.default
  }

  /**
   * Set default
   */
  public setDefault(data: string) {
    return this.options.default = data
  }

  /**
   * Required
   */
  public isRequired(): boolean {
    return typeof this.options.default == 'undefined'
  }

  /**
   * Beauty name (for print)
   */
  public beautyName(): string {
    return `<${this.name}${!this.isRequired() ? '?' : ''}>`
  }

}
