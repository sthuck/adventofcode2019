import {expect} from 'chai';
import {task1, parseLine, runActions} from './index';

describe('task1', () => {
    it('', () => {
        const input = `deal into new stack
        cut -2
        deal with increment 7
        cut 8
        cut -4
        deal with increment 7
        cut 3
        deal with increment 9
        deal with increment 3
        cut -1`.split('\n');
        const actions = input.map(parseLine);
        const stack = runActions(10, actions);
        console.log(stack);
    });
});
describe('task2', () => {

});

