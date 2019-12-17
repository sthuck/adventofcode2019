import {range, max, flatten, maxBy, filter, isEqual, sortBy} from 'lodash';
const log = (...args: any[]) => {
  if (process.env.LOG) {
    console.log(...args);
  }
}

type Grid = Array<Array<{x: number, y: number, hasAsteroid: boolean}>>;
export const parseInput = (lines: string[]): Grid => {
  return lines.map((line, y) => line.split('').map((cell, x) => ({x, y, hasAsteroid: cell === '#'})));
}

const point = (x: number, y: number) => ({x, y})

export const allPointsInRadius = (source: {x: number, y: number}, radius: number, grid: Grid) => {
  const {x, y} = source;
  const upperRightPoints = range(x, x + radius).map(x => point(x, y - radius));
  const rightSidePoints = range(y - radius, y + radius).map(y => point(x + radius, y));
  const bottomPoints = range(x + radius, x - radius).map(x => point(x, y + radius));
  const leftSidePoints = range(y + radius, y - radius).map(y => point(x - radius, y));
  const upperRightLeft = range(x - radius, x).map(x => point(x, y - radius));
  return upperRightPoints.concat(rightSidePoints, bottomPoints, leftSidePoints, upperRightLeft).filter(({x, y}) =>
    !(x < 0 || x >= grid[0].length || y < 0 || y >= grid.length)
  )
}

const computeAngleRelativeYAxes = ({x, y}) => {
  const fromX = Math.atan2(y, x) * 180 / Math.PI;
  const fromY = fromX - 90;
  return (360 - ((fromY + 360) % 360)) % 360;
}


export const findViewableAsteroids = (source: {x: number, y: number}, grid: Grid) => {
  const {x: xSource, y: ySource} = source;

  const setAngles = new Set<number>();
  const detected = [];
  const radiusTillEdge = max([grid.length - ySource, grid[0].length - xSource, Math.abs(0 - ySource), Math.abs(0 - xSource)]);

  range(1, grid.length).forEach(radius => {
    const pointsToScan = allPointsInRadius({x: xSource, y: ySource}, radius, grid);


    pointsToScan.forEach(({x, y}) => {
      if (!(x === xSource && y === ySource)) {
        if (grid[y][x].hasAsteroid) {
          const relativeX = x - xSource
          const relativeY = y - ySource;
          const angle = Math.atan2(relativeY, relativeX);
          if (!setAngles.has(angle)) {
            detected.push({x, y});
            setAngles.add(angle);
          }
        }
      }
    });
  });

  return detected;
}


function findBestPlace(grid: {x: number; y: number; hasAsteroid: boolean;}[][]) {
  const list = flatten(grid.map((row, y) => row.map((cell, x) => {
    if (cell.hasAsteroid) {
      return {x, y, howMany: findViewableAsteroids({x, y}, grid).length};
    }
    return;
  }))).filter(v => v !== undefined);
  const bestPlace = maxBy(list, 'howMany');
  return bestPlace;
}

const pointsDistance = (a: {x, y}, b: {x, y}) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
const sortPoints = (base: {x, y}) => (a: {x, y}, b: {x, y}) => {
  const angleA = computeAngleRelativeYAxes({x: a.x - base.x, y: (base.y - a.y)});
  const angleB = computeAngleRelativeYAxes({x: b.x - base.x, y: (base.y - b.y)});
  if (angleA < angleB) {
    return -1;
  } else if (angleB < angleA) {
    return 1;
  } else {
    const distanceA = pointsDistance(base, a);
    const distanceB = pointsDistance(base, b);
    if (distanceA < distanceB) {
      return -1;
    } else if (distanceB < distanceA) {
      return 1;
    } else {
      throw new Error();
    }
  }
}

export const task1 = (input: string[]) => {
  const grid = parseInput(input);
  return findBestPlace(grid);
}

export const task2 = (input: string[]) => {
  const grid = parseInput(input);
  const {x, y} = findBestPlace(grid);
  let destryoed = [];
  
  while (destryoed.length < 200) {
    const allOtherPoints = filter(
      flatten(range(grid.length)
        .map(y => range(grid[0].length)
          .map(x => ({x, y})))),
      point => grid[point.y][point.x].hasAsteroid && !isEqual(point, {x, y}));

    const pointsSorted = allOtherPoints.sort(sortPoints({x, y}))
    const setAngles = new Set<number>();

    pointsSorted.forEach(point => {
      const relativePoint = {x: point.x - x, y: (y - point.y)};
      const angle = computeAngleRelativeYAxes(relativePoint);
      if (!setAngles.has(angle)) {
        destryoed.push(point);
        setAngles.add(angle);
        grid[point.y][point.x].hasAsteroid = false;
      }
    });
  }
  return [destryoed[199]];
}

