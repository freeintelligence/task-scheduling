/*
 * Base command
 * */
export interface BaseCommand {

  name?: string
  description?: string
  flags?: any
  run?: (...args: any[]) => any

}
