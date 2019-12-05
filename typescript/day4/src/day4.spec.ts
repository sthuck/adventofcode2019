import {expect} from 'chai';
import {howManyMatch, neverDecreases, criteriaTwoDigits, criteriaTwoDigitsPhase2} from './index';

describe('task1', () => {
  it('', () => {
    expect(neverDecreases(111111)).to.be.true
    expect(criteriaTwoDigits(111111)).to.be.true
    expect(neverDecreases(223450)).to.be.false
    expect(criteriaTwoDigits(123789)).to.be.false
  })
});

describe('task2', () => {
  it('', () => {
    expect(criteriaTwoDigitsPhase2(123444)).to.be.false
    expect(criteriaTwoDigitsPhase2(112233)).to.be.true
    expect(criteriaTwoDigitsPhase2(111122)).to.be.true
  })
});