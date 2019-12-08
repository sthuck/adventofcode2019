import {expect} from 'chai';
import {countRowN, parseLine, countLayerN} from './index';

describe('task1', () => {
  it('', () => {
    expect(countRowN(1)(parseLine('123456789012'))).to.eq(2);
    expect(countRowN(1)(parseLine('12345678901211'))).to.eq(4);
  });
  
  it('', () => {
    expect(countLayerN(0)([[1, 5, 6], [0, 1, 4], [0, 0 , 5]])).to.eql(3)  
  })
});