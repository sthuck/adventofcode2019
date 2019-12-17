import * as shell from 'shelljs';
import * as yargs from 'yargs';

const argv = yargs.command('gen <day>', 'generate template', (builder) => {builder.positional('day', {
  describe: 'what day to generate'
})}, args => {
  main(args).catch(console.error)
}).help().argv



function wrap(rv: shell.ShellString, msg: string) {
  
  if (rv.code !== 0) {
    console.error('code ', rv.code);
    console.error(msg);
    process.exit(rv.code);
  }
}

async function main(args: any) {
  
  const day = args.day;
  wrap(shell.mkdir(`./day${day}`), 'Error creating dir');
  wrap(shell.mkdir(`./day${day}/src`), 'Error creating dir');
  wrap(shell.touch(`./day${day}/src/input-1`), 'Error touching file');
  wrap(shell.cp('./template/*.json', `./day${day}`), 'Error in copy');
  wrap(shell.cp('./template/*.json', `./day${day}`), 'Error in copy');
  shell.echo(indexFileTemplate(day)).to(`./day${day}/src/index.ts`)
  shell.echo(runnerFileTemplate(day)).to(`./day${day}/src/runner.ts`)
  shell.echo(specFileTemplate(day)).to(`./day${day}/src/day${day}.spec.ts`)
}

function indexFileTemplate(day: number) {
  return (
`import {} from 'lodash';

export const parseLine = (line: string) => {
  return line.split('').map(s => parseInt(s, 10))
}


export const task1 = (input: string) => {
}

export const task2 = (input: string) => {
}
`
  )
}

function runnerFileTemplate(day: number) {
  return (
`import * as fs from 'fs';
import * as path from 'path';
import {task1, task2} from './index';

const readFile = (filename: string): string =>
  // fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day${day}_1 = async () => {
  const input = readFile('./input-1');
  const result = task1(input);
  console.log({result});
}

const day${day}_2 = async () => {
  const input = readFile('./input-1');
  const result = task2(input);
  console.log({result});
}

day${day}_1();
day${day}_2();

`
  )
}
function specFileTemplate(day: number) {
  return (
`import {expect} from 'chai';
import {} from './index';

describe('task1', () => {

});
describe('task2', () => {

});
`
  )
}