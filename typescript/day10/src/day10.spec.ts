import {expect} from 'chai';
import {findViewableAsteroids, parseInput, allPointsInRadius, task2} from './index';

describe('task1', () => {
  it('', () => {
    const input = `.#..#
.....
#####
....#
...##`;
    const grid = parseInput(input.split('\n'));
    expect(allPointsInRadius({x: 2, y: 2}, 2, grid).length).to.eq(16);
  })
  it('', () => {
    const input = `.#..#
.....
#####
....#
...##`;
    const grid = parseInput(input.split('\n'));
    let detected = findViewableAsteroids({x: 3, y: 4}, grid);
    expect(detected.length).to.eql(8);
    detected = findViewableAsteroids({x: 1, y: 0}, grid);
    expect(detected.length).to.eql(7)
    detected = findViewableAsteroids({x: 0, y: 2}, grid);
    expect(detected.length).to.eql(6)
  })
});
describe.only('task2', () => {
  it('', () => {
    const input = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
    task2(input.split('\n'));
  })
});

