import {range, sum as sum_} from 'lodash';


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

const computePhase2 = (inputArr: number[]): number[] => {
  let nextInputArr = new Array(inputArr.length);
  let s = sum_(inputArr);
  for (let i = 0; i < inputArr.length; i++) {
    nextInputArr[i] = s % 10;
    s = s - inputArr[i];
  }
  return nextInputArr;
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
  const offset = pInt(tmp.slice(0, 7).join(''));
  inputArr = inputArr.slice(offset);
  console.log(inputArr.length);
  console.log(offset)
  range(100).forEach((i) => {
    console.log('main iteration', i)
    inputArr = computePhase2(inputArr);
  });
  const base = pInt(inputArr.slice(0, 8).join(''));
  return base;
}

