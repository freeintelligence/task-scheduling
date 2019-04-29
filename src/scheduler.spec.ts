import { Scheduler } from './scheduler.class'

describe('Scheduler instance', () => {

  const scheduler = new Scheduler()

  test('More than one command with the same name', async () => {
    expect.assertions(1)

    // 1
    scheduler.registerSimpleCommand('first', 'without description', [], () => null)
    // 2
    scheduler.registerSimpleCommand('first', 'without description', [], () => null)

    await expect(scheduler.execute(['first'])).resolves.toEqual(2)
  })

})
