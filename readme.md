# task-scheduling
Development of console applications.

## Table of Contents
* [How to use](#how-to-use)
* [Install](#install)
* [Commands](#commands)
  * [Create command](#create-command)
  * [Inline command](#inline-command)
  * [No name command](#no-name-command)
  * [Default 404 command](#default-404-command)
* [Aliases](#aliases)

## How to use
`main.js` / `main.ts`
```js
import { Scheduler, Flag } from 'task-scheduling'
import { ShowInfoCommand } from './commands/show-info-command'

// global flag (all commands)
Scheduler.registerFlag(new Flag('help', { alias: 'h', type: 'boolean', default: false }))
// add a command
Scheduler.registerCommand(new ShowInfoCommand())

// run / execute by a string
Scheduler.execute(['not-exists', '--help'])
Scheduler.execute(['show-info', '--data=22']) // or "node main.js show-info --data=22"
Scheduler.execute(['show-info', '--data', '22']) // or "node main.js show-info --data 22"
// run / execute by process argv
Scheduler.executeByProcess()
```
`commands/show-info-command.js` / `commands/show-info-command.ts`
```js
import { BaseCommand, Flag, Flags } from 'task-scheduling'

export class ShowInfoCommand extends BaseCommand {

  name: string = 'show-info'
  description: string = 'Show a message'
  flags: Flag[] = [
    new Flag('data', { alias: 'd', type: 'number', default: 2 })
  ]

  async run(@Flags() flags: Flags, @Flags('data') data: number) {
    console.log('What did you expect? A number? Take this:', data*2)
  }

}
```

## Install
```
// NPM
npm i task-scheduling --save

// Yarn
yarn add task-scheduling
```

## Commands
### Create command
The preferred way to create a command is through the `BaseCommand` class.
```js
import { Scheduler, BaseCommand } from 'task-scheduling'

export class MyFirstCommand extends BaseCommand {

  name = 'callme'
  description = 'Description of the command that will appear in the help message.'

  async run() {
    console.log('Thanks for invoking me.')
  }

}
Scheduler.registerCommand(new MyFirstCommand())
```
### Inline command
Another way to create commands is inline. **This option does not need to register the command with the "registerCommand" method.**
```js
import { task } from 'task-scheduling'

task('callme', 'Description of the command that will appear in the help message.', [], async () => {
  console.log('Thanks for invoking me.')
})
// "task" is an alias of "Scheduler.registerSimpleCommand"
```
### No name command
There are times when we need to execute a task even when a command is not received. For these cases we can register a "no name" command.
```js
import { Scheduler, BaseCommand, task } from 'task-scheduling'

export class NoNameCommand extends BaseCommand {

  // without name and description
  /*name = ''
  description = ''*/

  async run() {
    console.log('Use --help')
  }

}
Scheduler.registerCommand(new NoNameCommand())

// Or inline
task(undefined, undefined, [], async () => {
  console.log('Use --help')
})
```
### Default 404 command
If you try to execute a command not registered in the system, the "default" command will be executed.
```js
import { Scheduler, BaseCommand } from 'task-scheduling'

export class Default404Command extends BaseCommand {

  async run() {
    console.log('The command you are trying to execute is not valid. Use --help.')
  }

}
Scheduler.registerDefault(new Default404Command())

// Or inline
Scheduler.registerSimpleDefault(async () => {
  console.log('The command you are trying to execute is not valid. Use --help.')
})
```

## Aliases
Some main methods have an alias for faster, intuitive and clean code use.
```js
import { task } from 'task-scheduling'

const command_flags = [new Flag('data', { alias: 'd', type: 'number', default: 2 })]

//Scheduler.registerSimpleCommand
task('show-info', 'without description', command_flags, async ({ flags }) => {
  const data = flags.data.value
  console.log('What did you expect? A number? Take this:', data*2)
})
```
