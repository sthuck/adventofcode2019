import {expect} from 'chai';
import {task1} from './index';

describe('task1', () => {
  it('', () => {
    const input = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`.split('\n');
    console.log(task1(input));
  })
});
describe('task2', () => {

});

