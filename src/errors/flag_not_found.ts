import { BaseCommand } from './../command'

/*
 * Flag not found error
 * */
export class FlagNotFoundError extends Error {

  public name: string
  public value: string
  public command: BaseCommand

  constructor(name: string, value: string, command?: BaseCommand) {
    super(command && command.name ? `The flag --${name} is not registered in the "${command.name}" command.`: `The flag --${name} is not registered in the system.`)

    this.name = name
    this.value = value
    this.command = command
  }

}
