import {min, max, flatten, map, range} from 'lodash';
import {basicRun} from '../../day9/src';
import * as readline from 'readline';

const log = (...args: any[]) => {
  if (process.env.LOG) {
    console.log(...args);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pInt = (s: string) => parseInt(s, 10);
export const parseLine = (line: string) => {
  return line.split(',').map(pInt)
}

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

function pointToStr(x: number, y: number): string
function pointToStr(x: Array<number>): string
function pointToStr(x: number | Array<number>, y?: number) {
  return Array.isArray(x) ? `${x[0]},${x[1]}` : `${x},${y}`
}
type Point = [number, number];

function strToPoint(s: string): Point {
  return s.split(',').map(pInt) as Point;
}

const question = (what: string) => {
  return new Promise<string>(resolve => {
    rl.question(what, (answer) => {
      debugger;
      resolve(answer);
      rl.close();
    });
  })
}


export const task1 = async (input: string) => {
  let inputBuf: string[] = [];
  let outputBuf: string[] = [];
  const code = parseLine(input);
  await basicRun(code, code, async () => {
    if (inputBuf.length === 0) {
      debugger;
      const response = await question('');
      debugger;
      inputBuf = response.split('').concat(['\n']);
    };
    const item = inputBuf.shift()
    return item.charCodeAt(0);
  }, (_, rv) => {
    if (rv === 10) {
      console.log(outputBuf.join(''));
      outputBuf = [];
    } else {
      outputBuf.push(String.fromCharCode(rv));
    }
  });
}

export const task2 = (input: string) => {
}

