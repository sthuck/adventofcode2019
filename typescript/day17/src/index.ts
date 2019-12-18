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

enum Direction {
  north = 0,
  east = 1,
  south = 2,
  west = 3,
}

const directionLeft = (dir: Direction) => (dir - 1 + 4) % 4;
const directionRight = (dir: Direction) => (dir + 1 + 4) % 4;

const directionMap = {
  [Direction.north]: [0, -1],
  [Direction.south]: [0, 1],
  [Direction.west]: [-1, 0],
  [Direction.east]: [1, 0],
}

enum TileId {
  Scaffold = '#',
  OpenSpace = '.'
}


export class InfiniteGrid {
  painted: Record<number, Record<number, {tile: TileId, position: Point}>> = {
  };
  robotPos: Point;
  robotDirection: Direction;
  constructor(private defaultTile = TileId.OpenSpace) {
  }

  paintPos(x, y, char: string) {
    let tile: TileId;
    if ([TileId.OpenSpace, TileId.Scaffold].includes(char as TileId)) {
      tile = char as TileId;;
    } else {
      if (['^', 'v', '<', '>'].includes(char)) {
        this.robotPos = [x, y];
        this.robotDirection = ['^', '>', 'v', '>'].indexOf(char);
        tile = TileId.Scaffold;
      } else if (char === 'X') {
        this.robotPos = [x, y];
        tile = TileId.OpenSpace;
      } else {
        // console.error(x,y,char);
        // throw new Error('weird char');
        tile = char as any;
      }
    }

    if (!this.painted[y]) {
      this.painted[y] = [];
    }
    this.painted[y][x] = ({tile, position: [x, y]})
  }

  getTile(x, y) {
    if (this.painted[y] === undefined || this.painted[y][x] === undefined) {
      // return this.defaultTile;
      return '*';
    }
    return this.painted[y][x].tile;
  }

  getTileChar(x, y) {
    if (x === this.robotPos[0] && y === this.robotPos[1]) {
      const map = {
        [Direction.east]: '>',
        [Direction.north]: '^',
        [Direction.south]: 'v',
        [Direction.west]: '<',
      }
      return map[this.robotDirection];
    } else {
      return this.getTile(x, y)
    }
  }

  printGrid() {
    const minY = min((Object.keys(this.painted).map(pInt)));
    const maxY = max((Object.keys(this.painted).map(pInt)));
    const minX = min(flatten(map(this.painted, vector => (Object.keys(vector).map(pInt)))));
    const maxX = max(flatten(map(this.painted, vector => (Object.keys(vector).map(pInt)))));
    const s = range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => this.getTileChar(x, y)).join('')).join('\n');
    global.asyncPrint.addFrame(s);
  }

  private getNeighbors(x, y, not = []) {
    return map(directionMap, ([addX, addY]) => [x + addX, y + addY] as Point).filter(p => !not.includes(this.getTile(...p)));
  }

  public findIntersections() {
    debugger;
    const allPointsScaffolding = flatten(
      map(Object.keys(this.painted),
        y => map(Object.keys(this.painted[y]), x => [x, y].map(pInt) as Point)))
      .filter(([x, y]) => this.getTile(x, y) === TileId.Scaffold);
    const allIntersections = allPointsScaffolding
      .filter(([x, y]) => this.getNeighbors(x, y)
        .every(n => this.getTile(...n) === TileId.Scaffold));
    return allIntersections;
  }

  walkForwardTillEnd() {
    const [dx, dy] = directionMap[this.robotDirection];
    let [x, y] = this.robotPos;
    let steps = 0;
    while (this.getTile(x + dx, y + dy) === TileId.Scaffold) {
      steps++;
      x += dx; y += dy; this.robotPos = [x, y];
      this.printGrid();
    }
    return steps;
  }

  turn(turn: 'right' | 'left') {
    const newDir = (turn === 'right' ? directionRight : directionLeft)(this.robotDirection);
    const [dx, dy] = directionMap[newDir];
    let [x, y] = this.robotPos;
    if (this.getTile(x + dx, y + dy) === TileId.Scaffold) {
      this.robotDirection = newDir;
      return true;
    }
    return false;
  }

  walkMap() {
    const path = [];
    while (true) {
      this.printGrid();
      const stepsForward = this.walkForwardTillEnd();
      if (stepsForward) {
        path.push(stepsForward);
      }
      if (this.turn('right')) {
        path.push('R');
      } else if (this.turn('left')) {
        path.push('L')
      } else {
        break;
      }
    }
    return path;
  }
}

export const parseGridStr = (gridStr: string): InfiniteGrid => {
  const grid = new InfiniteGrid();
  let x = 0;
  let y = 0;
  for (const char of gridStr) {
    if (char === '\n') {
      x = 0;
      y += 1;
      continue;
    }
    grid.paintPos(x, y, char);
    x++;
  }
  return grid;
}

export const task1 = async (input: string) => {
  const code = parseLine(input);

  const inputFn = () => {
    throw new Error();
  }

  let charCodes = [];
  await basicRun(code, code, inputFn, (_, rv) => {
    charCodes.push(rv);
  });

  const gridStr = String.fromCharCode(...charCodes);
  const grid = parseGridStr(gridStr);

  const intersections = grid.findIntersections();
  const alignmentParameterSum = sum(intersections, ([x, y]) => x * y);
  return alignmentParameterSum;
}


export const walkMapHelper = async (input: string) => {
  const code = parseLine(input);

  const inputFn = () => {
    throw new Error();
  }

  let charCodes = [];
  await basicRun(code, code, inputFn, (_, rv) => {
    charCodes.push(rv);
  });

  const gridStr = String.fromCharCode(...charCodes);
  const grid = parseGridStr(gridStr);
  const path = grid.walkMap();
  return path;
}

export const task2 = async (input: string) => {
  const code = parseLine(input);

  const solution = [
    'ABACABCBCB'.split('').join(','),
    ['R', 8, 'L', 10, 'L', 12, 'R', 4].join(','),
    ['R', 8, 'L', 12, 'R', 4, 'R', 4].join(','),
    ['R', 8, 'L', 10, 'R', 8].join(','),
    'y',
    ''
  ].join('\n')
  let pos = 0;

  const inputFn = () => {
    return Promise.resolve(solution.charCodeAt(pos++));
  }

  code[0] = 2;
  let result;
  await basicRun(code, code, inputFn, (_, rv) => {
    if (rv > 255) {
      result = rv;
    } else {
      process.stdout.write(String.fromCharCode(rv));
    }
  });

  // const gridStr = String.fromCharCode(...charCodes);
  // const grid = parseGridStr(gridStr);
  // grid.printGrid();
  // const path = grid.walkMap();
  return result;
}

