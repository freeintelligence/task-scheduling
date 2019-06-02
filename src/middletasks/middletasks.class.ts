import { BaseMiddletask } from './middletask.class'

/**
 * Data interface
 */
interface MiddletaskData {
  name: string|null,
  constructor: BaseMiddletask
}

/**
 * Middletasks instance
 */
export class Middletasks {

  /**
   * Data
   */
  private container_middletasks: MiddletaskData[] = []

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Reset
   */
  public reset() {
    this.container_middletasks = []
    return this
  }

  /**
   * Register middletask
   */
  public push(name: string|null, constructor: BaseMiddletask) {
    this.container_middletasks.push({ name: name, constructor: constructor })
    return this
  }

  /**
   * Get all middletasks
   */
  public getAll() {
    return this.container_middletasks
  }

  /**
   * Get middletask by name
   */
  public getByName(name: string): BaseMiddletask {
    const result = this.getAll().find(e => e.name == name)

    return result ? result.constructor : null
  }

}
