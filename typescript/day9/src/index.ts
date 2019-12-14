import {} from 'lodash';
export const parseLine = (line: string) => {
  return line.split(',').map(s => parseInt(s, 10))
}
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

export enum ParameterMode {
  memory,
  immediate,
  relative
}

type ParameterModes = [ParameterMode, ParameterMode, ParameterMode]

const extractParam = (p: ParameterModes, code: number[], memory: number[], currentPos: number, baseOffset: number) => (index: number) => ({
  get() {
    const pType = p[index - 1];
    switch (pType) {
      case ParameterMode.immediate:
        return code[currentPos + index];
      case ParameterMode.memory:
        const v = memory[code[currentPos + index]];
        return typeof v === 'undefined' ? 0 : v;
      case ParameterMode.relative:
        const v2 = memory[baseOffset + code[currentPos + index]];
        return typeof v2 === 'undefined' ? 0 : v2;
      default:
        throw new Error();
    }
  },
  set(value: number) {
    const pType = p[index - 1];
    switch (pType) {
      case ParameterMode.memory:
        return memory[code[currentPos + index]] = value;
      case ParameterMode.relative:
        return memory[baseOffset + code[currentPos + index]] = value;
      case ParameterMode.immediate:
      default:
        throw new Error();
    }
  }
})

const opcodesFactory = (inputFn: (title: string) => Promise<number>, outputFn: (title: string, output: number) => any): Record<number, Function> => ({
  1: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    param(3).set(a + b);
    return [currentPos + 4, baseOffset]
  },
  2: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    param(3).set(a * b);
    return [currentPos + 4, baseOffset]
  },
  3: async (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const inputResponse: any = await inputFn('enter input: ');
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    param(1).set(inputResponse);
    return [currentPos + 2, baseOffset];
  },
  4: async (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    outputFn('output', a);
    return [currentPos + 2, baseOffset];
  },
  5: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    if (a !== 0) {
      log('jumping to pos:', b)
      return [b, baseOffset];
    }
    return [currentPos + 3, baseOffset];
  },
  6: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    if (a === 0) {
      log('jumping to pos:', b)
      return [b, baseOffset];
    }
    return [currentPos + 3, baseOffset];
  },
  7: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    param(3).set(a < b ? 1 : 0);

    return [currentPos + 4, baseOffset]
  },
  8: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();
    const b = param(2).get();
    param(3).set(a === b ? 1 : 0);

    return [currentPos + 4, baseOffset]
  },
  9: (p: ParameterModes, currentPos: number, arr: number[], memory: number[], baseOffset: number) => {
    const param = extractParam(p, arr, memory, currentPos, baseOffset);
    const a = param(1).get();

    return [currentPos + 2, baseOffset + a]
  },
  99: (p: ParameterModes, currentPos: number, arr: number[], memory, baseOffset: number) => {
    return [arr.length, baseOffset];
  }
});

export const parseInstruction = (fullInstruction: number) => {
  log({fullInstruction});
  const opcode = fullInstruction % 100;
  const instructionStr = '0000' + fullInstruction;
  const n = instructionStr.length;
  const modes = [n - 3, n - 4, n - 5]
    .map(index => instructionStr[index] === '1' ?
      ParameterMode.immediate :
      instructionStr[index] === '2' ?
        ParameterMode.relative :
        ParameterMode.memory);
  return {opcode, modes}
}

export const basicRun = async (arr: number[], memory: (string | number)[], inputFn = question, outputFn = console.log, stopHook = null) => {
  const opcodes = opcodesFactory(inputFn, outputFn);
  let currentPos = 0;
  let baseOffset = 0;
  
  while (currentPos < arr.length) {
    const {modes, opcode} = parseInstruction(arr[currentPos]);
    log({modes, opcode});
    ([currentPos, baseOffset] = await opcodes[opcode](modes, currentPos, arr, memory, baseOffset))
    log({currentPos});

    if (stopHook) {
      const shouldStop = stopHook();
      if (shouldStop) {
        break;
      }
    }
  }
}

export const task1 = (input: string) => {
  const code = parseLine(input.split('\n')[0]);
  const memory = [...code];
  return basicRun(code, memory);
}

export const task2 = (input: string) => {
}

