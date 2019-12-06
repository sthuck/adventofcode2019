import {expect} from 'chai';
import {basicRun, parseLine, parseInstruction, ParameterMode} from './index';

describe('task1', () => {
  it('', () => {
    expect(parseInstruction(1002)).to.deep.eq({opcode: 2, modes: [ParameterMode.memory, ParameterMode.immidiate, ParameterMode.memory]})
  })

  it('', async () => {
    let output;
    const arr = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
      1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
      999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    await basicRun(arr, arr, () => Promise.resolve(1), (_, value) => output = value);
    console.log(output)
  });
  it('', async () => {
    let output;
    const arr = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
      1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
      999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    await basicRun(arr, arr, () => Promise.resolve(8), (_, value) => output = value);
    console.log(output)
  });
  it('', async () => {
    let output;
    const arr = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
      1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
      999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    await basicRun(arr, arr, () => Promise.resolve(9), (_, value) => output = value);
    console.log(output)
  })
});
