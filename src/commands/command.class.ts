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

}
