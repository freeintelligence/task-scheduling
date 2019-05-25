import { BaseCommand } from './../commands'

/*
 * Extra not found error
 * */
export class ExtraNotFoundError extends Error {

  public only_name: string
  public only_extra: string

  constructor(only_name: string, only_extra: string) {
    super(`The '${only_name}' command needs the '${only_extra}' argument.`)

    this.only_name = only_name
    this.only_extra = only_extra
  }

}
