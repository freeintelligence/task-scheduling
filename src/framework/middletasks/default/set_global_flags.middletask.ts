import { Scheduler } from './../../scheduler.class'
import { BaseMiddletask } from './../../middletasks'
import { BaseCommand } from './../../commands'
import { Flag } from './../../flags'
import { Resource } from './../../inspector'
import { RequiredFlagValueError } from './../../errors'

/**
 * Set global flags
 */
export class SetGlobalFlagsMiddletask extends BaseMiddletask {

  protected scheduler: Scheduler
  protected command: BaseCommand
  protected flags: { [name: string]: Flag }

  /**
   * Handle method
   */
  async handle() {
    const from: Resource[] = this.inspector.getFlags()
    const values_array: Resource[] = this.inspector.getExtras()

    for(let [ name, flag ] of Object.entries(this.flags)) {
      if(flag.options.type !== 'array') {
        const resource_flag = from.find(e => (!e.used && e.type == 'flag' && flag.getNames().indexOf(e.name) !== -1) || (!e.used && e.type == 'flag-alias' && flag.getAliases().indexOf(e.name) !== -1))

        if(!resource_flag && flag.isRequired()) {
          throw new RequiredFlagValueError(this.command, flag)
        }

        flag.value = resource_flag && typeof resource_flag.value !== 'undefined' ? resource_flag.value : flag.getDefault()

        if(resource_flag) {
          resource_flag.used = true
        }
      }
      else {
        const resource_flag = from.find(e => (!e.used && e.type == 'flag' && flag.getNames().indexOf(e.name) !== -1) || (!e.used && e.type == 'flag-alias' && flag.getAliases().indexOf(e.name) !== -1))

        if(!resource_flag && flag.isRequired()) {
          throw new RequiredFlagValueError(this.command, flag)
        }
        else if(!resource_flag && !flag.isRequired()) {
          flag.value = flag.getDefault()
        }
        else {
          const resource_values = values_array.filter(e => !e.used && e.index >= resource_flag.index)
          const arr: any[] = []

          if(!resource_values.length && flag.isRequired()) {
            throw new RequiredFlagValueError(this.command, flag)
          }

          if(typeof resource_flag.value !== 'undefined' && typeof resource_flag.value != 'string' || (typeof resource_flag.value == 'string' && resource_flag.value.length)) {
            resource_flag.used = true
            arr.push(resource_flag.value)
          }

          resource_values.forEach(resource => {
            arr.push(resource.value)
            resource.used = true
          })

          flag.value = arr
          resource_flag.used = true
        }
      }
    }
  }

}
