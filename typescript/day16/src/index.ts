import {range} from 'lodash';


const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);
const pInt = (s: string) => parseInt(s, 10);

const buildPattern = (length: number, indexInOutput: number) => {
  const base = [0, 1, 0, -1];
  const pattern = [];
  for (let i = 0; i < length + 1; i++) {
    var digit = base[(Math.floor(i / (indexInOutput + 1)) % base.length)];
    pattern.push(digit);
  }
  return pattern.slice(1);
}
export const parseLine = (line: string) => {
  return line.split('').map(pInt);
}


const computeDigit = (inputArr: number[], index: number): number => {
  if (index % 100 == 0) console.log('sub iteration:', index);
  const pattern = buildPattern(inputArr.length, index);
  return Math.abs(sum(inputArr.map((n, i) => n * pattern[i]), n => n) % 10);
}

export const task1 = (input: string) => {
  let inputArr = parseLine(input);
  range(100).forEach(() => {
    debugger;
    inputArr = range(inputArr.length).map(i => computeDigit(inputArr, i));
  });
  return inputArr.slice(0, 8);
}

export const task2 = (input: string) => {
  let tmp = parseLine(input);
  let inputArr = new Array(10000 * tmp.length);
  for (let i = 0; i < 10000 * tmp.length; i++) {
    inputArr[i] = tmp[i % tmp.length];
  }

  range(100).forEach((i) => {
    console.log('main iteration', i)
    inputArr = inputArr.map((_, i) => computeDigit(inputArr, i));
  });
  const base = pInt(inputArr.slice(0, 8).join(''));
  return inputArr.slice(base, 8).join('');
}

