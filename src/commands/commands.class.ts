import { BaseCommand } from'./../interfaces'

/*
 * Commands instance
 * */
export class Commands {

  /*
   * Data
   * */
  private container_commands: BaseCommand[] = []
  private container_default: BaseCommand[] = []

  /*
   * Reset
   * */
  reset() {
    this.container_commands = []
    this.container_default = []
    return this
  }

  /*
   * Register command
   * */
  push(instance: BaseCommand) {
    this.container_commands.push(this.fixCommand(instance))
    return this
  }

  /*
   * Register default command
   * */
  default(instance: BaseCommand) {
    this.container_default.push(this.fixCommand(instance))
  }

  /*
   * Fix command instance
   * */
  private fixCommand(instance: BaseCommand) {
    if(typeof instance.name !== 'string' || !instance.name.length) {
      instance.name = undefined
    }
    else {

    }

    if(typeof instance.description !== 'string' || !instance.description.length) {
      instance.description = undefined
    }
    if(typeof instance.flags !== 'object' || instance.flags == null || !(instance instanceof Object)) {
      instance.flags = { }
    }
    if(typeof instance.run !== 'function') {
      instance.run = async () => { }
    }
    return instance
  }

  /*
   * Get commands by tasks
   * */
  async getByTasks(tasks: string[]) {

  }

}
