/*
 * Flag not found error
 * */
export class FlagNotFoundError extends Error {

  public name: string
  public value: string

  constructor(name: string, value: string) {
    super(`The flag --${name} is not registered in the system.`)

    this.name = name
    this.value = value
  }

}
