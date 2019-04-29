import { BaseCommand } from './../command'

/*
 * Extra not found error
 * */
export class ExtraNotFoundError extends Error {

  public only_name: string
  public only_extra: string
  public command: BaseCommand

  constructor(only_name: string, only_extra: string, command: BaseCommand) {
    super(`The '${only_name}' command needs the '${only_extra}' argument.`)

    this.only_name = only_name
    this.only_extra = only_extra
    this.command = command
  }

}
