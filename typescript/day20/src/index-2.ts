import {flatten, range, minBy} from 'lodash';

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);
const pInt = (s: string) => parseInt(s, 10);

function pointToStr(x: number, y: number, level?: number): string
function pointToStr(x: Array<number>): string
function pointToStr(x: number | Array<number>, y?: number, level?: number) {
  return Array.isArray(x) ?
    `${x[0]},${x[1]}` + (x[2] !== undefined ? `,${x[2]}` : '')
    :
    `${x},${y}` + (level !== undefined ? `,${level}` : '');
}

type Point = [number, number, number];
type ProtoPoint = [number, number];

function strToPoint(s: string): Point {
  return s.split(',').map(pInt) as Point;
}

enum Tile {
  wall = '#',
  empty = ' ',
  path = '.',
}

export const parseLines2 = (input: string) => {
  const r = /[A-Z]/
  const gridWithLabels = input.split('\n').map(line => line.split(''));
  const labelsToPoint: Record<string, ProtoPoint[]> = {};
  const pointToLabel: Record<string, string> = {};

  gridWithLabels.forEach((row, y) => row.forEach((cell, x) => {
    if (r.test(cell)) {
      const offsets = [2, -1];
      offsets.forEach(offset => {
        if (gridWithLabels[y + offset] && gridWithLabels[y + offset][x] === Tile.path) {
          const label = gridWithLabels[y][x] + gridWithLabels[y + 1][x];
          gridWithLabels[y][x] = gridWithLabels[y + 1][x] = ' ';
          const point = [x, y + offset] as ProtoPoint;
          labelsToPoint[label] = labelsToPoint[label] ? labelsToPoint[label].concat([point]) : [point];
          pointToLabel[pointToStr(point)] = label;
        }
      })
      offsets.forEach(offset => {
        if (gridWithLabels[y] && gridWithLabels[y][x + offset] === Tile.path) {
          const label = gridWithLabels[y][x] + gridWithLabels[y][x + 1];
          gridWithLabels[y][x] = gridWithLabels[y][x + 1] = ' ';
          const point = [x + offset, y] as ProtoPoint;
          labelsToPoint[label] = labelsToPoint[label] ? labelsToPoint[label].concat([point]) : [point];
          pointToLabel[pointToStr(point)] = label;
        }
      });
    }
  }));


  return {grid: gridWithLabels, labelsToPoint, pointToLabel}
}

const isPointOnEdge = (data: Data, point: Point) => {
  const [x, y] = point;
  const xLen = data.grid[0].length;
  const yLen = data.grid.length;
  return (x === 2 || x === xLen - 3) || (y === 2 || y === yLen - 3);
}

const getNeighbors = (data: Data, point: Point): Point[] => {
  const {grid, labelsToPoint, pointToLabel} = data;

  const directionsMap = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  const neighbors: Point[] = [];
  const [x, y, level] = point;
  directionsMap.forEach(([dx, dy]) => {
    if (grid[y + dy][x + dx] === Tile.path) {
      neighbors.push([x + dx, y + dy, level]);
    }
  });

  if (pointToLabel[pointToStr(x, y)]) {
    debugger;
    const onEdge = isPointOnEdge(data, point);
    const isOuterLevel = level === 0;
    const label = pointToLabel[pointToStr(x ,y)];
    if ((label === 'AA' || label === 'ZZ') && !isOuterLevel) {
      return neighbors;
    }
    if (onEdge && isOuterLevel) {
      return neighbors;
    }
    const nextLevel = onEdge ? level - 1 : level + 1;
    const otherPoint = labelsToPoint[label].find(p => pointToStr(p) !== pointToStr(x, y));
    if (otherPoint) neighbors.push([...otherPoint, nextLevel] as Point);
  }
  return neighbors;
}

function findShortestPath(data: Data, startingP: Point, endP: Point) {
  const {grid, labelsToPoint, pointToLabel} = data;
  const starting = pointToStr(startingP);
  const end = pointToStr(endP);

  const dist = new Map();
  const prev = new Map();
  const Q = new Set([starting]);
  const visited = new Set();
  dist.set(starting, 0);

  while (Q.size > 0) {

    const u = minBy([...Q.values()], (key) => dist.get(key) ?? Infinity);
    Q.delete(u);
    visited.add(u);
    if (u === end) {
      break;
    }

    const uPoint = strToPoint(u);
    const neighbors = getNeighbors(data, uPoint).map(pointToStr).filter(ps => !visited.has(ps));
    const alt = (dist.get(u) ?? Infinity) + 1;
    neighbors.forEach(v => {
      const vDist = (dist.get(v) ?? Infinity);
      if (alt < vDist) {
        dist.set(v, alt);
        prev.set(v, u)
      }
      Q.add(v)
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

type Data = ReturnType<typeof parseLines2>;
export const task2 = (input: string) => {
  const data = parseLines2(input);
  const {grid, labelsToPoint, pointToLabel} = data;
  const startingPoint = [...labelsToPoint['AA'][0], 0] as Point;
  const endingPoint = [...labelsToPoint['ZZ'][0], 0] as Point;
  const {counter, path} = findShortestPath(data, startingPoint, endingPoint);
  return {counter, path};
}
