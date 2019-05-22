import { Extra } from './../extras'
import { Flag } from './../flags'

/*
 * Base command
 * */
export interface BaseCommand {

  name?: string | string[]
  description?: string
  flags?: { [key: string]: Flag } | Flag[]
  extras?: { [key: string]: Extra }
  run?: (...args: any[]) => any

}
