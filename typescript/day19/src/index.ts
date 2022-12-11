import {min, max, flatten, map, range} from 'lodash';
import {basicRun} from '../../day9/src';

const pInt = (s: string) => parseInt(s, 10);
export const parseLine = (line: string) => {
  return line.split(',').map(pInt)
}

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

function pointToStr(x: number, y: number): string
function pointToStr(x: Array<number>): string
function pointToStr(x: number | Array<number>, y?: number) {
  return Array.isArray(x) ? `${x[0]},${x[1]}` : `${x},${y}`
}
type Point = [number, number];

function strToPoint(s: string): Point {
  return s.split(',').map(pInt) as Point;
}


export const task1 = async (input: string) => {
  const code = parseLine(input);
  let map = {};
  const points: Point[] = flatten(range(50).map(x => range(50).map(y => [x, y] as Point)));

  for (const point of points) {
    let xyIndex = 0;
    const copy = [...code]
    await basicRun(copy, copy, () =>
      Promise.resolve(point[xyIndex++]), (_, rv) => map[pointToStr(point)] = rv);
  }
  return sum(Object.keys(map), key => map[key]);
}


const getBeamValue = async (code: number[], x, y) => {
  console.log('checking', x, y)
  const copy = [...code];
  let callCounter = 0;
  let output;
  await basicRun(copy, copy, () =>
    Promise.resolve(callCounter++ ? y : x), (_, rv) => output = rv);
  return output;
}

export const task2 = async (input: string) => {
  const code = parseLine(input);

  let x = 0; let y = 0;

  while (await getBeamValue(code, x + 99, y) === 0) {
    y += 1
    while (await getBeamValue(code, x, y + 99) === 0) {
      x += 1
    }
  }
  return (x * 10000 + y)
}

