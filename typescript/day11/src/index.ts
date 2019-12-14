import {range, min, max, flatten, map} from 'lodash';
import {basicRun} from '../../day9/src';

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);


export const parseLine = (line: string) => {
  return line.split(',').map(s => parseInt(s, 10))
}

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}
const moveMap = {
  [Direction.UP]: [0, -1],
  [Direction.RIGHT]: [1, 0],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
}

export enum TurnDirection {
  LEFT_TURN,
  RIGHT_TURN,
}

export enum Color {
  Black,
  White
}

type Point = [number, number];


export class InfiniteGrid {
  private currentPos: Point = [0, 0];
  private direction = Direction.UP;
  painted: Record<number, Record<number, {color: Color, position: Point}>> = {};
  constructor(private startingPositionColor = Color.Black) {}

  turn(direction: TurnDirection) {
    const turnValue = direction === TurnDirection.LEFT_TURN ? -1 : 1;
    this.direction = (this.direction + turnValue + 4) % 4;
  }

  move() {
    const howToMove = moveMap[this.direction];
    this.currentPos = [0, 1].map(i => this.currentPos[i] + howToMove[i]) as Point;
    const [x, y] = this.currentPos;
  }

  paint(color: Color) {
    const [x, y] = this.currentPos;
    if (!this.painted[y]) {
      this.painted[y] = [];
    }
    this.painted[y][x] = ({color, position: [x, y]})
  }

  getColor() {
    const [x, y] = this.currentPos;
    return this.getColorPos(x, y);
  }

  getColorPos(x, y) {
    if (x === 0 && y === 0) {
      return this.startingPositionColor;
    }

    if (this.painted[y] === undefined || this.painted[y][x] === undefined) {
      return Color.Black;
    }
    return this.painted[y][x].color;
  }

  howManyPainted() {
    return sum(Object.keys(this.painted), rowIndex =>
      sum(Object.keys(this.painted[rowIndex]), cellIndex => this.painted[rowIndex][cellIndex] !== undefined ? 1 : 0))
  }

  printGrid() {
    debugger;
    const minY = min((Object.keys(this.painted).map(n => parseInt(n, 10))));
    const maxY = max((Object.keys(this.painted).map(n => parseInt(n, 10))));
    const minX = min(flatten(map(this.painted, vector => (Object.keys(vector).map(n => parseInt(n, 10))))));
    const maxX = max(flatten(map(this.painted, vector => (Object.keys(vector).map(n => parseInt(n, 10))))));
    const s = range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => this.getColorPos(x, y) === Color.White ? '#' : ' ').join('')).join('\n')
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
  const outputHelper = new CollectOutput(2, (color: Color, turn: TurnDirection) => {
    grid.paint(color);
    grid.turn(turn);
    grid.move();
  });
  const code = parseLine(input);

  const inputFn = () => Promise.resolve(grid.getColor());

  const memory = [...code];
  await basicRun(code, code, inputFn, outputHelper.outputFn);
  return grid.howManyPainted();
}

export const task2 = async (input: string) => {
  const grid = new InfiniteGrid(Color.White);
  const outputHelper = new CollectOutput(2, (color: Color, turn: TurnDirection) => {
    grid.paint(color);
    grid.turn(turn);
    grid.move();
  });
  const code = parseLine(input);

  const inputFn = () => Promise.resolve(grid.getColor());

  await basicRun(code, code, inputFn, outputHelper.outputFn);
  grid.printGrid();
}

