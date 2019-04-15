import { Flag } from './../flag'

/*
 * Invalid flag value type error
 * */
export class InvalidFlagValueError extends Error {

  public flag: Flag

  constructor(flag: Flag) {
    let flag_name = ''
    if(flag.name) flag_name += `--${flag.name}`
    if(flag.options.alias) flag_name += flag_name.length ? ' '+`[-${flag.options.alias}]` : `[-${flag.options.alias}]`

    super(`The type of data received for the flag ${flag_name} is invalid. A '${flag.options.type+(flag.options.type == 'array' ? '<'+flag.options.subtype+'>' : '')}' was expected.`)

    this.flag = flag
  }

}
