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
* [Flags](#flags)
  * [Valid uses](#valid-uses)
  * [Create flag](#create-flag)
  * [Add flag to command](#add-flag-to-command)
  * [Type of data](#type-of-data)
  * [Type array](#type-array)
  * [Get flag value](#get-flag-value)
* [Help messages](#help-messages)
  * [Print help](#print-help)
* [Mini API](#mini-api)
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

## Flags
### Valid uses
The reading of the values of the flags accepts the formats:
```
example-command --name value1
example-command -n value1
example-command --name=value1
example-command -n=value1

example-command --files file1.js file2.js file3.js // for array type
example-command -f file1.js file2.js file3.js // for array type
```

### Create flag
The way to create a flag instance is with the `Flag` class.
**Note: It is not advisable to create the flags in files separated from the commands, this is just an example where they are separated so that the procedure is better understood.**
`flags/complete-name-flag.js` / `flags/complete-name-flag.ts`
```js
import { Flag } from 'task-scheduling'

export const CompleteNameFlag = new Flag('complete-name', {
  description: 'to show in help',
  alias: 'c', // To use as: "command-name --flag-one value1 -c value2"
  type: 'string',
  default: 'Horus from the ground fuck',
})
```
### Add flag to command
`commands/say-hello-command.js` / `commands/say-hello-command.ts`
```js
import { BaseCommand } from 'task-scheduling'
import { CompleteNameFlag } from './../flags/complete-name-flag'

export class SayHelloCommand extends BaseCommand {

  name = 'say-hello'
  description = 'Send me a simple greeting!'
  flags = [CompleteNameFlag]

}
```
**Recommended format:**
`commands/say-hello-command.js` / `commands/say-hello-command.ts`
```js
import { BaseCommand, Flag } from 'task-scheduling'

export class SayHelloCommand extends BaseCommand {

  name = 'say-hello'
  description = 'Send me a simple greeting!'
  flags = [
    new Flag('complete-name', { description: 'to show in help', alias: 'c', type: 'string', default: 'Horus' })
  ]

}
```
### Type of data
The available types of data for the flags are ([Valid uses](#valid-uses)):
#### **string**
```js
new Flag('name', { type: 'string', default: 'MyNameIs (that\'s my name)' })
```
```
example-command --name=Biig
example-command --name "Biig Piig"
example-command --name= // This will return an empty string ('')
```
#### **boolean**
```js
new Flag('help', { alias: 'h', type: 'boolean', default: false })
```
```
example-command --help // true
example-command -h // true
example-command --help=true
example-command --help=1
example-command --help=false
example-command --help=0
```
#### **number**
```js
new Flag('add', { type: 'number', default: 4 })
```
```
example-command --add // 4
example-command --add=9
example-command --add 44
```
#### **object**
```js
new Flag('json', { type: 'object', default: { data: null, of: null, obj: null } })
```
```
example-command --json="{ data: 'to show', show: 'to data' }"
example-command --json "{ data: 'to show', show: 'to data' }"
```
#### **array**
```js
new Flag('files', { type: 'array', default: ['file1.js'] })
```
```
example-command --files file1.js file2.js file3.js file4.js
```
### Type array
The array type has the peculiarity of a data subtype. This is because it is necessary to know to what type of data corresponds the information that is expected to be received.
```js
new Flag('files', { type: 'array', subtype: 'string', default: ['index.js'] })
new Flag('answers', { type: 'array', subtype: 'boolean', default: [true, false, true, true] })
new Flag('sum', { type: 'array', subtype: 'number', default: [0] })
// ...
```
### Get flag value
Once we have done the command and it is executed, we need to know what value was established for the flag. For this we occupy the decorator **@Flags**:
```js
import { BaseCommand, Flags, Flag, Scheduler } from 'task-scheduling'

export class NoNameCommand extends BaseCommand {

  flags = [
    new Flag('--help', { alias: 'h', type: 'boolean', default: false, description: 'Show help message.' })
  ]

  async run(@Flags() flags: Flags, @Flags('help') help: boolean) {
    if(help) { // or "flags.help.value"
      console.log(Scheduler.help())
    }
    else {
      console.log('Use --help')
    }
  }

}
```
**On inline commands** it's a bit different (and Javascript). Since decorators are not supported in anonymous functions, the only way to obtain the flags is:
```js
import { BaseCommand, Flag, Scheduler, task } from 'task-scheduling'

task(
  undefined,
  undefined,
  [ new Flag('--help', { alias: 'h', type: 'boolean', default: false, description: 'Show help message.' }) ],
  async ({ flags }) => {
    if(flags.help.value) {
      console.log(Scheduler.help())
    }
    else {
      console.log('Use --help')
    }
})
```

## Aliases
Some main methods have an alias for faster, intuitive and clean code use.
```js
import { task, Flag } from 'task-scheduling'

const command_flags = [new Flag('data', { alias: 'd', type: 'number', default: 2 })]

//Scheduler.registerSimpleCommand
task('show-info', 'without description', command_flags, async ({ flags }) => {
  const data = flags.data.value
  console.log('What did you expect? A number? Take this:', data*2)
})
```
