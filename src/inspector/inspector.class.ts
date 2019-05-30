/**
 * Resource
 */
export interface Resource {
  index: number,
  type: 'command'|'extra'|'flag'|'flag-alias',
  name?: string,
  value: string,
  used?: boolean,
}

/**
 * Inspector class
 */
export class Inspector {

  /**
   * Data
   */
  private tasks: string[]
  public resources: Resource[] = []

  /**
   * Constructor
   */
  constructor(tasks: string[]) {
    this.byTasks(tasks)
  }

  /**
   * Is flag
   */
  public static isFlag(task: string): boolean {
    if(task == '--' || task == '-') return false

    return /^(\-{1,2})(.+)$/g.test(task)
  }

  /*
   * Is flag alias (only alias)
   **/
  public static isFlagAlias(task: string): boolean {
    return /^\-([^\-])+$/g.test(task)
  }

  /**
   * Is flag (complete name or alias) with value (in the same line)
   */
  public static isFlagWithValue(task: string): boolean {
    if(!this.isFlag(task)) return false

    return task.indexOf('=') !== -1
  }

  /**
   * Get only flag name
   */
  public static getOnlyFlagName(task: string): string {
    if(!this.isFlag(task)) return '';

    return task.substr(this.isFlagAlias(task) ? 1 : 2).split('=')[0]
  }

  /**
   * Get only flag value
   */
  public static getOnlyFlagValue(tasks: string | string[]): string {
    if(typeof tasks == 'string') {
      if(!this.isFlagWithValue(<string>tasks)) {
        return ''
      }

      return (<string>tasks).split('=')[1]
    }
    else {
      const next = tasks.shift()

      if(next && !this.isFlag(next)) {
        return next
      }
    }

    return ''
  }

  /**
   * Is command or extra
   */
  public static isCommand(task: string): boolean {
    return !this.isFlag(task)
  }

  /**
   * Inspect tasks array
   */
  public byTasks(tasks: string[]) {
    this.tasks = tasks ? tasks : []
    this.resources = []

    for(let i = 0; i < this.tasks.length; i++) {
      const task = tasks[i].trim()
      const next = tasks[i+1]

      if(Inspector.isFlag(task)) {
        const type = Inspector.isFlagAlias(task) ? 'flag-alias' : 'flag'
        const name = Inspector.getOnlyFlagName(task)
        const value = Inspector.getOnlyFlagValue(Inspector.isFlagWithValue(task) ? task : tasks.slice(i+1))

        this.resources.push({ index: i, type: type, name: name, value: value })

        if(!Inspector.isFlag(next)) {
          i++
        }
      }
      else if(Inspector.isCommand(task)) {
        this.resources.push({ index: i, type: !this.resources.find(e => e.type == 'command') ? 'command' : 'extra', value: task })
      }
    }
  }

  /**
   * Get command
   */
  public getCommand() {
    return this.resources.find(e => e.type == 'command') || { type: 'command', index: 0, value: undefined }
  }

  /**
   * Get extras
   */
  public getExtras() {
    return this.resources.filter(e => e.type == 'extra')
  }

  /**
   * Get flags
   */
  public getFlags(include_alias: boolean = true) {
    return this.resources.filter(e => e.type == 'flag' || e.type == 'flag-alias')
  }

  /**
   * Get this instance of new by tasks[]
   */
  public thisOr(tasks?: string[]) {
    if(typeof tasks === 'undefined') return this;

    return new Inspector(tasks)
  }

}
