import {expect} from 'chai';
import {parseGridStr} from './index';

describe('task1', () => {

  it('', () => {
    const input =
      `..#..........
..#..........
#######...###
#.#...#...#.#
#############
..#...#...#..
..#####...^..`;
    const grid = parseGridStr(input);
    console.log(grid.findIntersections());

  })
});
describe('task2', () => {

});

