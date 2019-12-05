import {cloneDeep} from 'lodash';
export const parseLine = (line: string): number[] => {
  return line.split(',').map(n => parseInt(n, 10))
}

const opcodes: Record<number, Function> = {
  1: (currentPos: number, arr: number[]) => {
    const a = arr[arr[currentPos + 1]]
    const b = arr[arr[currentPos + 2]]
    arr[arr[currentPos + 3]] = a + b
    return currentPos + 4;
  },
  2: (currentPos: number, arr: number[]) => {
    const a = arr[arr[currentPos + 1]]
    const b = arr[arr[currentPos + 2]]
    arr[arr[currentPos + 3]] = a * b
    return currentPos + 4;
  },
  99: (currentPos: number, arr: number[]) => {
    return arr.length;
  }
}
const opcodesPhase2: Record<number, Function> = {
  1: (currentPos: number, arr: number[], memory: (number| string)[]) => {
    const a = memory[arr[currentPos + 1]]
    const b = memory[arr[currentPos + 2]]
    memory[arr[currentPos + 3]] = `(${a} + ${b})`;
    return currentPos + 4;
  },
  2: (currentPos: number, arr: number[], memory: (number| string)[]) => {
    const a = memory[arr[currentPos + 1]]
    const b = memory[arr[currentPos + 2]]
    memory[arr[currentPos + 3]] = `(${a} * ${b})`;
    return currentPos + 4;
  },
  99: (currentPos: number, arr: number[]) => {
    return arr.length;
  }
}

export const basicRun = (arr: number[]) => {
  let currentPos = 0;
  while (currentPos < arr.length) {
    currentPos = opcodes[arr[currentPos]](currentPos, arr)
  }
  return arr;
}

export const basicRun2 = (arr: number[], memory: (string | number)[]) => {
  let currentPos = 0;
  while (currentPos < arr.length) {
    currentPos = opcodesPhase2[arr[currentPos]](currentPos, arr, memory)
  }
}

export const runPhase1 = (arr: number[]) => {
  arr[1] = 12;
  arr[2] = 2;
  return basicRun(arr)[0];
}

export const runPhase2 = (arr: number[]) => {
  const memory: (string|number)[] = cloneDeep(arr);
  memory[1] = 'noun';
  memory[2] = 'verb';
  basicRun2(arr, memory);
  return memory;
}

