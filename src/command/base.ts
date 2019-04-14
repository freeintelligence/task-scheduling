import { Flag } from './../flag'

/*
 * Base command
 * */
export class BaseCommand {

  public name: string
  public description: string
  public flags: Flag[] = []

  /*
   * Run code
   * */
  async run(...args: any[]) {

  }

}
