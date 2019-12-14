import {expect} from 'chai';
import {task1} from './index';

describe('task1', () => {
  it('', () => {
    const input = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`.split('\n');
    const energy = task1(input, 100);
    expect(energy).to.eq(1940);
  });
});
describe('task2', () => {

});

