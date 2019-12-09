import {expect} from 'chai';
import {parseMove, task1, task2} from './index';

describe('task1', () => {
  it('', () => {
    expect(parseMove('U212')).to.deep.equal({count: 212, direction: 'U'})
  })
  it('', () => {
    const input = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`;
    const res = task1(input.split('\n'));
    expect(res).to.eql(159)
  });
  it('', () => {
    const input = `R8,U5,L5,D3
U7,R6,D4,L4`;
    const res = task1(input.split('\n'));
    expect(res).to.eql(6)
  });
  it('', () => {
    const input = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`;
    const res = task2(input.split('\n'));
    expect(res).to.eql(610)
  });
});