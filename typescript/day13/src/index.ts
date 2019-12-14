import {range, min, max, flatten, map} from 'lodash';
import {basicRun} from '../../day9/src';

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);


export const parseLine = (line: string) => {
  return line.split(',').map(s => parseInt(s, 10))
}

enum TileId {
  empty,
  wall,
  block,
  paddle,
  ball,

}

const printChar = (tile: TileId) => {
  switch (tile) {
    case TileId.ball:
      return 'O';
    case TileId.wall:
      return '+'
    case TileId.empty:
      return ' '
    case TileId.paddle:
      return '=';
    case TileId.block:
      return 'B'
  }
}

type Point = [number, number];


export class InfiniteGrid {
  painted: Record<number, Record<number, {tile: TileId, position: Point}>> = {};
  constructor(private defaultTile = TileId.empty) {}
  public paddlePos: Point;
  public ballPos: Point;

  paintPos(x, y, tile: TileId) {
    if (!this.painted[y]) {
      this.painted[y] = [];
    }
    if (tile === TileId.ball) {
      this.ballPos = [x, y];
    }
    if (tile === TileId.paddle) {
      this.paddlePos = [x, y];
    }
    this.painted[y][x] = ({tile, position: [x, y]})
  }

  getTile(x, y) {
    if (x === 0 && y === 0) {
      return this.defaultTile;
    }

    if (this.painted[y] === undefined || this.painted[y][x] === undefined) {
      return this.defaultTile;
    }
    return this.painted[y][x].tile;
  }

  howManyBlockTiles() {
    return sum(map(this.painted, row => row), row =>
      sum(map(row, cell => cell), cell => cell !== undefined && cell.tile === TileId.block ? 1 : 0));
  }

  printGrid() {
    const minY = min((Object.keys(this.painted).map(n => parseInt(n, 10))));
    const maxY = max((Object.keys(this.painted).map(n => parseInt(n, 10))));
    const minX = min(flatten(map(this.painted, vector => (Object.keys(vector).map(n => parseInt(n, 10))))));
    const maxX = max(flatten(map(this.painted, vector => (Object.keys(vector).map(n => parseInt(n, 10))))));
    const s = range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => printChar(this.getTile(x, y))).join('')).join('\n');
    process.stdout.write('\x1b[2J');
    console.log(s);
  }
}

export class CollectOutput {
  private buffer: number[];
  private counter: number = 0;

  constructor(private howMany: number, private hookFn: (...args: number[]) => any) {
    this.reset();
    this.outputFn = this.outputFn.bind(this);
  }

  private reset() {
    this.buffer = new Array(this.howMany);
    this.counter = 0;
  }

  outputFn(_, value: number) {
    this.buffer[this.counter] = value;
    this.counter++;
    if (this.counter === this.howMany) {
      this.hookFn(...this.buffer);
      this.reset();
    }
  }
}

export const task1 = async (input: string) => {
  const grid = new InfiniteGrid();
  const outputHelper = new CollectOutput(3, (x: number, y: number, tile: TileId) => {
    grid.paintPos(x, y, tile);
  });
  const code = parseLine(input);

  const inputFn = () => Promise.resolve(0);

  const memory = [...code];
  await basicRun(code, code, inputFn, outputHelper.outputFn);
  return grid.howManyBlockTiles();
}

export const task2 = async (input: string) => {
  const grid = new InfiniteGrid();
  let gameStarted = false;
  let score = undefined;
  const outputHelper = new CollectOutput(3, (x: number, y: number, tile: TileId) => {
    if (x === -1 && y === 0) {
      score = tile;
    }
    grid.paintPos(x, y, tile);
  });
  const code = parseLine(input);

  const inputFn = () => {
    let value = 0;
    const [xBall] = grid.ballPos;
    const [xPaddle] = grid.paddlePos;
    if (xBall > xPaddle) {
      value = 1
    } else if (xBall < xPaddle) {
      value = -1;
    }
    return Promise.resolve(value)
  }

  code[0] = 2;
  // await basicRun(code, code, inputFn, outputHelper.outputFn);
  await basicRun(code, code, inputFn, outputHelper.outputFn, () => {
    grid.printGrid();
    const blockTiles = grid.howManyBlockTiles();
    if (!gameStarted && blockTiles > 250) {
      gameStarted = true;
      return false;
    }
    if (gameStarted && blockTiles === 0) {
      return true;
    }
    return false;
  });
  return score;
}

