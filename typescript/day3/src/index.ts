import {range, min} from 'lodash';

export enum Direction {
  Right = 'R',
  Up = 'U',
  Left = 'L',
  Down = 'D'
}

interface Move {
  direction: Direction,
  count: number;
}

type Point = [number, number];
export const pointToStr = (point: Point) => `${point[0]},${point[1]}`;
export const strToPoint = (point: string): Point => point.split(',').map(s => parseInt(s, 10)) as Point

export const parseMove = (move: string) => {
  const match = /([RULD]+)(\d+)/.exec(move);
  return {
    direction: match[1] as any,
    count: parseInt(match[2], 10)
  }
}

export const parseInput = (lines: string[]) => {
  return lines.map(line => line.split(',').map(parseMove))
}

export const pointsAfterMove = (initialPoint: Point, move: Move) => {
  const base = [Direction.Down, Direction.Left].includes(move.direction) ? -1 : 1;
  const index = [Direction.Down, Direction.Up].includes(move.direction) ? 1 : 0;
  const points = range(move.count)
    .map(i => index ? [initialPoint[0], initialPoint[1] + (i + 1) * base] as Point : [initialPoint[0] + (i + 1) * base, initialPoint[1]] as Point);
  return {points, current: points[points.length - 1]};
}

export const allPointsOfLine = (moves: Move[]) => {
  let allPoints: Point[] = [];
  let currentPoint: Point = [0, 0];
  moves.forEach(move => {
    const {current, points} = pointsAfterMove(currentPoint, move);
    currentPoint = current;
    allPoints.push.apply(allPoints, points)
  });
  return allPoints;
}

export const findIntersection = (movesA: Move[], movesB: Move[]) => {
  const pointsA = allPointsOfLine(movesA).map(pointToStr);
  const pointsB = allPointsOfLine(movesB).map(pointToStr);
  const pointsBSet = new Set(pointsB)
  const allIntersectingPoints = (pointsA.filter(p => pointsBSet.has(p)));
  return {allIntersectingPoints, pointsA, pointsB}
}

export const task1 = (input: string[]) => {
  const [moveA, moveB] = parseInput(input);
  let {allIntersectingPoints} = findIntersection(moveA, moveB);
  
  return min(allIntersectingPoints
    .filter(f => f !== '0,0').map(strToPoint)
    .map(p => Math.abs(p[0]) + Math.abs(p[1])))
}

export const task2 = (input: string[]) => {
  const [moveA, moveB] = parseInput(input);
  let {allIntersectingPoints, pointsA, pointsB} = findIntersection(moveA, moveB);
  return min(allIntersectingPoints
    .filter(f => f !== '0,0')
    .map(f => pointsA.indexOf(f) + 1  + pointsB.indexOf(f) + 1));
}