import {range} from 'lodash';
const pInt = (s: string) => parseInt(s, 10);

export const parseLine = (line: string) => {
  if (/deal with increment/.test(line)) {
    const [_, numberMatch] = /(-?\d+)/.exec(line);
    return {
      type: ActionType.dealIncrement,
      metadata: pInt(numberMatch),
    }
  }
  if (/cut/.test(line)) {
    const [_, numberMatch] = /(-?\d+)/.exec(line);
    return {
      type: ActionType.cut,
      metadata: pInt(numberMatch),
    }
  }
  return {
    type: ActionType.dealNew,
    metadata: 0
  }
}

enum ActionType {
  cut,
  dealIncrement,
  dealNew
}

interface Action {
  type: ActionType,
  metadata: number;
}

const dealIntoNewStack = (stack: number[]) => stack.reverse();

const cut = (stack: number[], howMuch: number) => {
  if (howMuch > 0) {
    const cutted = stack.splice(0, howMuch);
    return stack.concat(cutted);
  } else {
    howMuch = howMuch * -1;
    const cutted = stack.splice(stack.length - howMuch, howMuch);
    return cutted.concat(stack);
  }
}

const dealWithIncrement = (stack: number[], increment: number) => {
  debugger;
  const newStack = new Array(stack.length);
  let counter = 0;
  for (let i = 0; i < stack.length; i++) {
    newStack[counter] = stack[i];
    counter = (counter + increment) % stack.length;
  }
  return newStack;
}

export const task1 = (input: string[], size = 10007) => {
  debugger;
  const actions = input.map(parseLine);
  let stack = runActions(size, actions);
  return stack.indexOf(2019);
}


export function runActions(size: number, actions: {type: ActionType; metadata: number;}[]) {
  const fnMap = {
    [ActionType.cut]: cut,
    [ActionType.dealIncrement]: dealWithIncrement,
    [ActionType.dealNew]: dealIntoNewStack,
  };
  let stack = range(size);
  actions.forEach((action, i) => {
    console.log('iteration', i);
    stack = fnMap[action.type](stack, action.metadata);
  });
  return stack;
}

export const task2 = (input: string) => {
}

