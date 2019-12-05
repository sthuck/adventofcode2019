import {expect} from 'chai';
import {basicRun, parseLine} from './index';

describe('task1', () => {
  it('', () => {
    expect(basicRun([1,0,0,0,99])).to.eql([2,0,0,0,99])
    expect(basicRun([1,1,1,4,99,5,6,0,99])).to.eql([30,1,1,4,2,5,6,0,99])
    expect(basicRun([2,4,4,5,99,0])).to.eql([2,4,4,5,99,9801])
  })
});
