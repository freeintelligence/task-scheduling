import { Configure } from './configure.class'
import { Flags } from './../flags'

describe('Configure instance', () => {

  const flags = new Flags()
  const configure = new Configure(flags)

  beforeEach(() => {
    configure.flags.reset()
  })

  test('The global help flag is created and deleted as configured', () => {
    expect(flags.getAll()).toHaveLength(0)

    configure.global_help = true
    expect(flags.getAll()).toHaveLength(1)

    configure.global_help = false
    expect(flags.getAll()).toHaveLength(0)
  })

})
