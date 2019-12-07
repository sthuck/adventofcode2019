import {expect} from 'chai';
import {runPhaseSequence, caretsianProduct, task1, permutations, task2} from './index';

describe('task1', () => {
  it('', async () => {
    const input = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]
    const sequence = '43210'.split('').map(s => parseInt(s, 10));
    const result = await runPhaseSequence(sequence, input)
    expect(result).to.eq(43210)
  });

  it('', async () => {
    const input = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
      101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0]
    const sequence = '01234'.split('').map(s => parseInt(s, 10));
    const result = await runPhaseSequence(sequence, input)
    expect(result).to.eq(54321)
  });

  it('', () => {
    const result = caretsianProduct([0, 1, 5], 2)
    expect(result).to.eql(['00', '01', '05', '10', '11', '15', '50', '51', '55'])
  })

  it('', () => {
    const result = permutations([0, 1, 5])
    expect(result).to.eql(['015', '051', '105', '150', '501', '510'])
  })

  it('', async () => {
    const code = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    const result = await task1(code)
    expect(result.maxValue).to.eq(54321)
  });

  it('', async () => {
    const code = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
    const result = await task2(code)
    expect(result.maxValue).to.eq(139629729)
  })
});