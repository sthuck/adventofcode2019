import {basicRun, parseLine} from '../../day5/src'
import {flatten, range} from 'lodash';
import {EventEmitter} from 'events';
import {runInThisContext} from 'vm';
import {resolve} from 'dns';

export {parseLine};

const generatorToFunction = <T extends Array<any>, V>(genFn: () => Generator<V, void>) => {
  const iter = genFn();
  return function () {
    const next = iter.next()
    if (next.done) {
      throw new Error('no more values')
    } else {
      return Promise.resolve(next.value as V);
    }
  }
}

export const runPhaseSequence = async (sequence_: number[] | string, code: number[]) => {
  const sequence = Array.isArray(sequence_) ? sequence_ : sequence_.split('').map(s => parseInt(s, 10))
  let nextInput = 0;

  for (const phaseSetting of sequence) {
    const input = generatorToFunction(function* () {
      yield phaseSetting;
      yield nextInput;
    });

    const memory = [...code];
    await basicRun(code, memory, input, (_, v) => nextInput = v)
  }
  return nextInput;
}

export const caretsianProduct = (alphabet: Array<string | number>, length: number) => {
  let options = [''];
  for (let i = 0; i < length; i++) {
    options = flatten(options.map(option => alphabet.map(toAdd => option + toAdd.toString())));
  }
  return options;
}

export const permutations = (alphabet: Array<string | number>): string[] => {
  if (alphabet.length === 0) {
    return [''];
  }
  const result = range(alphabet.length).map(index => {
    const letter = alphabet[index].toString();
    const nextAlphabet = [...alphabet];
    nextAlphabet.splice(index, 1);

    const nextPermutations = permutations(nextAlphabet)
    return nextPermutations.map(p => letter + p);
  });
  return flatten(result);
}

export const task1 = async (input: string) => {
  const code = parseLine(input);
  let maxValue = -Infinity;
  let maxCombination = '';
  const combinations = permutations([0, 1, 2, 3, 4]);
  for (const combo of combinations) {
    const result = await runPhaseSequence(combo, code);
    if (result > maxValue) {
      maxCombination = combo;
      maxValue = result;
    }
  }
  return {maxCombination, maxValue};
}

class Pipe<T> {
  constructor(public id = '') {}
  que = [];
  lastValue = undefined;

  emitter = new EventEmitter();
  readValue() {
    if (this.que.length) {
      const v = this.que.shift()
      return Promise.resolve(v);
    } else {
      return new Promise(resolve => {
        this.emitter.once('write', () => {
          resolve(this.que.shift());
        });
      });
    }
  }

  writeValue(value) {
    this.que.push(value);
    this.lastValue = value;
    this.emitter.emit('write');
  }
}

export const runPhaseSequenceInParallel = async (sequence_: number[] | string, code: number[]) => {
  const sequence = Array.isArray(sequence_) ? sequence_ : sequence_.split('').map(s => parseInt(s, 10));
  const n = sequence.length;

  const pipes = range(n).map((i) => new Pipe(`pipe_${i}`));
  const inputFunctions = range(n).map(i => () => pipes[i].readValue());
  const outputFunctions = range(n).map(i => (_, v) => i === n - 1 ? pipes[0].writeValue(v) : pipes[i + 1].writeValue(v));
  range(n).forEach(i => pipes[i].writeValue(sequence[i]));
  pipes[0].writeValue(0);

  await Promise.all(range(n).map((i) => {
    const memory = [...code];
    return basicRun(code, memory, inputFunctions[i], outputFunctions[i]);
  }));

  return pipes[0].lastValue;
}

export const task2 = async (input: string) => {
  
  const code = parseLine(input);
  let maxValue = -Infinity;
  let maxCombination = '';
  const combinations = permutations([5, 6, 7, 8, 9]);
  for (const combo of combinations) {
    const result = await runPhaseSequenceInParallel(combo, code);
    if (result > maxValue) {
      
      maxCombination = combo;
      maxValue = result;
    }
  }
  return {maxCombination, maxValue};
}