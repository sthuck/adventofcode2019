import {expect} from 'chai';
import {InfiniteGrid, CollectOutput, Color, TurnDirection} from './index';

describe('task1', () => {
  it('', () => {
    const grid = new InfiniteGrid();
    const outputHelper = new CollectOutput(2, (color: Color, turn: TurnDirection) => {
      grid.paint(color);
      grid.turn(turn);
      grid.move();
    });
    outputHelper.outputFn('', 1);
    outputHelper.outputFn('', 0);

    outputHelper.outputFn('', 0);
    outputHelper.outputFn('', 0);

    outputHelper.outputFn('', 1);
    outputHelper.outputFn('', 0);
    outputHelper.outputFn('', 1);
    outputHelper.outputFn('', 0);

    outputHelper.outputFn('', 0);
    outputHelper.outputFn('', 1);

    outputHelper.outputFn('', 1);
    outputHelper.outputFn('', 0);
    outputHelper.outputFn('', 1);
    outputHelper.outputFn('', 0);

    expect(grid.howManyPainted()).to.eq(6);
    console.log((grid as any).currentPos);
  })
});
describe('task2', () => {

});

