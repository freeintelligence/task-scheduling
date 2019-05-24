import { Extras } from './extras.class'
import { Extra } from './extra.class'

describe('Extras static methods', () => {

  test('Extras by name (string)', () => {
    expect(Extras.extrasByName('command-name')).toEqual({
      name: 'command-name',
      extras: { }
    })
    expect(Extras.extrasByName('command-name extra1=default-value')).toEqual({
      name: 'command-name',
      extras: {
        extra1: new Extra('extra1', { default: 'default-value'})
      }
    })
    expect(Extras.extrasByName('command-name extra1')).toEqual({
      name: 'command-name',
      extras: {
        extra1: new Extra('extra1', { })
      }
    })
  })

})
