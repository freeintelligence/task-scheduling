import { Extra } from './extra.class'

/**
 * Extras class
 */
export class Extras {

  /**
   * Generate extras by command name
   */
  public static extrasByName(command_name: string): { name: string, extras: { [name: string]: Extra } } {
    const parts: string[] = command_name.split(' ')
    const virtuals: string[] = parts.slice(1)
    const name = parts[0]
    const extras: { [name: string]: Extra } = { }

    virtuals.forEach(part => {
      const data = part.split('=', 2)
      extras[data[0]] = new Extra(data[0], { default: data.length == 2 ? data[1] : undefined })
    })

    return { name, extras }
  }

}
