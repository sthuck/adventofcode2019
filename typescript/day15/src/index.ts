import {range, min, minBy, max, flatten, map, filter, every} from 'lodash';
import {basicRun} from '../../day9/src';
import * as assert from 'assert';
import * as Chance from 'chance';
const chance = new Chance();

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

const log = (...args: any[]) => {
  if (process.env.LOG) {
    log(...args);
  }
}

const pInt = (s: string) => parseInt(s, 10);
export const parseLine = (line: string) => {
  return line.split(',').map(pInt)
}

enum Direction {
  north = 1,
  south = 2,
  west = 3,
  east = 4
}
const mirrorDirection = (dir: Direction): Direction => dir % 2 === 0 ? dir - 1 : dir + 1;

function pointToStr(x: number, y: number): string
function pointToStr(x: Array<number>): string
function pointToStr(x: number | Array<number>, y?: number) {
  return Array.isArray(x) ? `${x[0]},${x[1]}` : `${x},${y}`
}

function strToPoint(s: string): Point {
  return s.split(',').map(pInt) as Point;
}

const directionMap = {
  [Direction.north]: [0, 1],
  [Direction.south]: [0, -1],
  [Direction.west]: [-1, 0],
  [Direction.east]: [1, 0],
}

enum TileId {
  wall,
  empty,
  oxygen,
  starting,
  unknown,
}

const printChar = (tile: TileId) => {
  switch (tile) {
    case TileId.oxygen:
      return 'O';
    case TileId.wall:
      return '#'
    case TileId.empty:
      return '.'
    case TileId.starting:
      return 'X'
    case TileId.unknown:
      return '?'
  }
}

type Point = [number, number];


export class InfiniteGrid {
  painted: Record<number, Record<number, {tile: TileId, position: Point, cameFrom: Direction}>> = {
    0: {0: {tile: TileId.empty, position: [0, 0], cameFrom: undefined}}
  };
  attemptedDirections: Record<string, Direction[]> = {[pointToStr(0, 0)]: []}
  currentPos: Point = [0, 0];
  currentAttemptedDirection: Direction;
  public oxygenPos: Point;
  constructor(private defaultTile = TileId.unknown) {
  }

  paintPos(x, y, tile: TileId, cameFrom: Direction) {
    if (!this.painted[y]) {
      this.painted[y] = [];
    }
    if (tile === TileId.oxygen) {
      this.oxygenPos = [x, y];
    }
    let cameFrom_ = (this.painted[y][x] && this.painted[y][x].cameFrom) ? this.painted[y][x].cameFrom : cameFrom;
    this.painted[y][x] = ({tile, position: [x, y], cameFrom: cameFrom_})
  }

  getTile(x, y) {
    if (x === 0 && y === 0) {
      return TileId.starting;
    }

    if (this.painted[y] === undefined || this.painted[y][x] === undefined) {
      return this.defaultTile;
    }
    return this.painted[y][x].tile;
  }

  printGrid() {
    const minY = min((Object.keys(this.painted).map(pInt)));
    const maxY = max((Object.keys(this.painted).map(pInt)));
    const minX = min(flatten(map(this.painted, vector => (Object.keys(vector).map(pInt)))));
    const maxX = max(flatten(map(this.painted, vector => (Object.keys(vector).map(pInt)))));
    const s = range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => printChar(this.getTile(x, y))).join('')).join('\n');
    process.stdout.write('\x1b[2J');
    console.log(s);
  }

  getAlreadyAttemptedDirections(point: Point) {
    const key = pointToStr(point);
    const currentAttempts = this.attemptedDirections[key] || (this.attemptedDirections[key] = []);
    return currentAttempts;
  }

  tryToMove(direction: Direction) {
    this.currentAttemptedDirection = direction;
    const allAttemptsForPosition = this.getAlreadyAttemptedDirections(this.currentPos)
    allAttemptsForPosition.push(direction);
    return;
  }

  finishMove(result: 0 | 1 | 2) {
    assert(this.currentAttemptedDirection, 'attempted direction must be set');
    const moveMap = directionMap[this.currentAttemptedDirection];
    const nextTile: Point = [this.currentPos[0] + moveMap[0], this.currentPos[1] + moveMap[1]];
    log('attempted to move to:', nextTile);

    switch (result) {
      case 0:
        log('found wall');
        this.paintPos(nextTile[0], nextTile[1], TileId.wall, mirrorDirection(this.currentAttemptedDirection));
        break;
      case 1:
        log('found empty');
        this.paintPos(nextTile[0], nextTile[1], TileId.empty, mirrorDirection(this.currentAttemptedDirection));
        this.currentPos = nextTile;
        break;
      case 2:
        log('found oxygen');
        this.paintPos(nextTile[0], nextTile[1], TileId.oxygen, mirrorDirection(this.currentAttemptedDirection));
        this.currentPos = nextTile;
    }
    this.currentAttemptedDirection = null;
  }

  getPossibleDirections() {
    const [x, y] = this.currentPos;
    let allDirections = [Direction.east, Direction.north, Direction.south, Direction.west];
    if (this.painted[y][x].cameFrom) {
      allDirections = allDirections.filter(d => d !== this.painted[y][x].cameFrom)
    }
    const alreadyAttempted = this.getAlreadyAttemptedDirections([x, y]);
    allDirections = allDirections.filter(d => !alreadyAttempted.includes(d));

    if (allDirections.length === 0) {
      return this.painted[y][x].cameFrom;
    } else {
      return chance.pickone(allDirections);
    }
  }

  private getNeighbors(x, y, not = [TileId.wall]) {
    return map(directionMap, ([addX, addY]) => [x + addX, y + addY] as Point).filter(p => !not.includes(this.getTile(...p)));
  }

  findShortestPath() {
    const starting = pointToStr([0, 0]);
    const end = pointToStr(this.oxygenPos);
    const allPoints = flatten(
      map(Object.keys(this.painted),
        y => map(Object.keys(this.painted[y]), x => [x, y].map(pInt) as Point)))
      .filter(([x, y]) => ![TileId.unknown, TileId.wall].includes(this.getTile(x, y)))
      .map(pointToStr);

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
      const neighbors = this.getNeighbors(...uPoint).map(pointToStr).filter(ps => Q.has(ps));
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

  isAllOxygen() {
    return every(this.painted, (row, y) => every(row, cell => [TileId.oxygen, TileId.wall].includes(cell.tile)))
  }

  fillWithOxygen(startingPoint: Point = this.oxygenPos) {
    debugger;
    let counter = -1; //-1 because of starting position
    let que = new Set([startingPoint]);
    while (que.size > 0) {
      counter++;
      let newQue = new Set<Point>();
      que.forEach(([x, y]) => {
        const neighbors = this.getNeighbors(x, y, [TileId.oxygen, TileId.wall]);
        neighbors.forEach(n => {
          this.painted[n[1]][n[0]].tile = TileId.oxygen;
          newQue.add(n);
        });        
      });
      que = newQue;
      this.printGrid();
      var waitTill = new Date(new Date().getTime() + 0.05 * 1000);
      while (waitTill > new Date()) {}
    }
    return counter;
  }
}


export const task1 = async (input: string) => {
  const grid = new InfiniteGrid();
  const code = parseLine(input);
  let counter = 0;

  const inputFn = () => {

    counter++
    log('current pos', grid.currentPos);
    const dir = grid.getPossibleDirections();
    log('trying to move to:', Direction[dir]);
    grid.tryToMove(dir);
    return Promise.resolve(dir);
  }

  const memory = [...code];
  await basicRun(code, code, inputFn, (_, rv) => {

    grid.finishMove(rv);
  }, () => !!grid.oxygenPos && counter > 4000);
  grid.printGrid();

  return {oxygenPos: grid.oxygenPos, ...grid.findShortestPath()};
}

export const task2 = async (input: string) => {
  const grid = new InfiniteGrid();
  const code = parseLine(input);
  let counter = 0;

  const inputFn = () => {

    counter++
    log('current pos', grid.currentPos);
    const dir = grid.getPossibleDirections();
    log('trying to move to:', Direction[dir]);
    grid.tryToMove(dir);
    return Promise.resolve(dir);
  }

  const memory = [...code];
  await basicRun(code, code, inputFn, (_, rv) => {

    grid.finishMove(rv);
  }, () => !!grid.oxygenPos && counter > 4000);
  grid.printGrid();
  const count = grid.fillWithOxygen();
  grid.printGrid();
  return count;
}

