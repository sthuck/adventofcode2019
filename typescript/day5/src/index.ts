import {cloneDeep} from 'lodash';
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

const question = (what: string) => {
  return new Promise<number>(resolve => {
    rl.question(what, (answer) => {
      resolve(parseInt(answer, 10));
      rl.close();
    });
  })
}


export const parseLine = (line: string): number[] => {
  return line.split(',').map(n => parseInt(n, 10))
}

const opcodesFactory = (inputFn: (title: string) => Promise<number>, outputFn: (title: string, output: number) => any): Record<number, Function> => ({
  1: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? arr[currentPos + 1] : memory[arr[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? arr[currentPos + 2] : memory[arr[currentPos + 2]]
    memory[arr[currentPos + 3]] = a + b;
    return currentPos + 4;
  },
  2: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? arr[currentPos + 1] : memory[arr[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? arr[currentPos + 2] : memory[arr[currentPos + 2]]
    memory[arr[currentPos + 3]] = a * b;
    return currentPos + 4;
  },
  3: async (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const inputResponse: any = await inputFn('enter input: ');
    memory[arr[currentPos + 1]] = inputResponse;
    return currentPos + 2;
  },
  4: async (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    debugger;
    const a = p[0] === ParameterMode.immidiate ? memory[currentPos + 1] : memory[memory[currentPos + 1]];
    outputFn('output', a);
    return currentPos + 2;
  },
  5: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? memory[currentPos + 1] : memory[memory[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? memory[currentPos + 2] : memory[memory[currentPos + 2]]
    if (a !== 0) {
      log('jumping to pos:', b)
      return b;
    }
    return currentPos + 3;
  },
  6: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? memory[currentPos + 1] : memory[memory[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? memory[currentPos + 2] : memory[memory[currentPos + 2]]
    if (a === 0) {
      log('jumping to pos:', b)
      return b;
    }
    return currentPos + 3;
  },
  7: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? memory[currentPos + 1] : memory[memory[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? memory[currentPos + 2] : memory[memory[currentPos + 2]]
    memory[memory[currentPos + 3]] = a < b ? 1 : 0;

    return currentPos + 4;
  },
  8: (p: ParameterModes, currentPos: number, arr: number[], memory: (number)[]) => {
    const a = p[0] === ParameterMode.immidiate ? memory[currentPos + 1] : memory[memory[currentPos + 1]]
    const b = p[1] === ParameterMode.immidiate ? memory[currentPos + 2] : memory[memory[currentPos + 2]]
    memory[memory[currentPos + 3]] = a === b ? 1 : 0;

    return currentPos + 4;
  },
  99: (p: ParameterModes, currentPos: number, arr: number[]) => {
    return arr.length;
  }
})

export enum ParameterMode {
  memory,
  immidiate
}

type ParameterModes = [ParameterMode, ParameterMode, ParameterMode]
export const parseInstruction = (fullInstruction: number) => {
  log({fullInstruction});
  const opcode = fullInstruction % 100;
  const instructionStr = '0000' + fullInstruction;
  const n = instructionStr.length;
  const modes = [n - 3, n - 4, n - 5]
    .map(index => instructionStr[index] === '1' ? ParameterMode.immidiate : ParameterMode.memory);
  return {opcode, modes}
}

export const basicRun = async (arr: number[], memory: (string | number)[], inputFn = question, outputFn = console.log) => {
  const opcodes = opcodesFactory(inputFn, outputFn);
  let currentPos = 0;
  while (currentPos < arr.length) {
    debugger;
    const {modes, opcode} = parseInstruction(arr[currentPos]);
    log({modes, opcode})
    currentPos = await opcodes[opcode](modes, currentPos, arr, memory)
    log({currentPos})
  }
}

export const runPhase1 = async (arr: number[]) => {
  // const memory: (number)[] = cloneDeep(arr);
  await basicRun(arr, arr);
  return arr;
}

