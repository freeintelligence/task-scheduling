/*
 * Command not found error
 * */
export class CommandNotFoundError extends Error {

  public name: string

  constructor(name: string) {
    super('Command not registered in the system')

    this.name = name
  }

}
