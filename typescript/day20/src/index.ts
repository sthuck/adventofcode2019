import {flatten, range, minBy} from 'lodash';

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);
const pInt = (s: string) => parseInt(s, 10);

function pointToStr(x: number, y: number): string
function pointToStr(x: Array<number>): string
function pointToStr(x: number | Array<number>, y?: number) {
  return Array.isArray(x) ? `${x[0]},${x[1]}` : `${x},${y}`
}
type Point = [number, number];

function strToPoint(s: string): Point {
  return s.split(',').map(pInt) as Point;
}

enum Tile {
  wall = '#',
  empty = ' ',
  path = '.',
}

export const parseLines = (input: string) => {
  const r = /[A-Z]/
  const gridWithLabels = input.split('\n').map(line => line.split(''));
  const labelsToPoint: Record<string, Point[]> = {};
  const pointToLabel: Record<string, string> = {};

  gridWithLabels.forEach((row, y) => row.forEach((cell, x) => {
    if (r.test(cell)) {
      const offsets = [2, -1];
      offsets.forEach(offset => {
        if (gridWithLabels[y + offset] && gridWithLabels[y + offset][x] === Tile.path) {
          const label = gridWithLabels[y][x] + gridWithLabels[y + 1][x];
          gridWithLabels[y][x] = gridWithLabels[y + 1][x] = ' ';
          const point = [x, y + offset] as Point;
          labelsToPoint[label] = labelsToPoint[label] ? labelsToPoint[label].concat([point]) : [point];
          pointToLabel[pointToStr(point)] = label;
        }
      })
      offsets.forEach(offset => {
        if (gridWithLabels[y] && gridWithLabels[y][x + offset] === Tile.path) {
          const label = gridWithLabels[y][x] + gridWithLabels[y][x + 1];
          gridWithLabels[y][x] = gridWithLabels[y][x + 1] = ' ';
          const point = [x + offset, y] as Point;
          labelsToPoint[label] = labelsToPoint[label] ? labelsToPoint[label].concat([point]) : [point];
          pointToLabel[pointToStr(point)] = label;
        }
      });
    }
  }));


  return {grid: gridWithLabels, labelsToPoint, pointToLabel}
}


const getNeighbors = (data: Data, point: Point): Point[] => {
  const {grid, labelsToPoint, pointToLabel} = data;

  const directionsMap = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  const neighbors = [];
  const [x, y] = point;
  directionsMap.forEach(([dx, dy]) => {
    if (grid[y + dy][x + dx] === Tile.path) {
      neighbors.push([x + dx, y + dy]);
    }
  });
  if (pointToLabel[pointToStr(point)]) {
    const label = pointToLabel[pointToStr(point)];
    const otherPoint = labelsToPoint[label].find(p => pointToStr(p) !== pointToStr(point));
    if (otherPoint) neighbors.push(otherPoint);
  }
  return neighbors;
}

function findShortestPath(data: Data, startingP: Point, endP: Point) {
  const {grid, labelsToPoint, pointToLabel} = data;
  const starting = pointToStr(startingP);
  const end = pointToStr(endP);
  const allPoints = flatten(range(grid.length).map(y=> range(grid[0].length).map(x => [x, y]))).map(pointToStr);

  const dist = new Map(allPoints.map(p => [(p), Infinity]));
  const prev = new Map(allPoints.map(p => [(p), undefined]));
  const Q = new Set(allPoints);
  dist.set(starting, 0);

  while (Q.size > 0) {

    const u = minBy([...Q.values()], (key) => dist.get(key));
    Q.delete(u);
    if (u === end) {
      break;
    }

    const uPoint = strToPoint(u);
    const neighbors = getNeighbors(data, uPoint).map(pointToStr).filter(ps => Q.has(ps));
    const alt = dist.get(u) + 1;
    neighbors.forEach(v => {
      const vDist = dist.get(v);
      if (alt < vDist) {
        dist.set(v, alt);
        prev.set(v, u)
      }
    });
  }

  let current = end;
  let counter = 0;
  const path = [];
  while (current !== starting) {
    current = prev.get(current);
    counter++;
    path.push(current);
  }
  return {counter, path}
}

type Data = ReturnType<typeof parseLines>;
export const task1 = (input: string) => {
  const data = parseLines(input);
  const {grid, labelsToPoint, pointToLabel} = data;
  const startingPoint = labelsToPoint['AA'][0];
  const endingPoint = labelsToPoint['ZZ'][0];
  const {counter, path} = findShortestPath(data, startingPoint, endingPoint);
  return {counter, path};
}
