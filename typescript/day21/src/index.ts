import {basicRun} from '../../day9/src';

import {} from 'lodash';

export const parseLine = (line: string) => {
  return line.split(',').map(s => parseInt(s, 10))
}


export const task1 = async (input: string) => {
  const inputToIntCode = [
    'NOT B T', // T = true if 2 away hole
    'OR T J', //if 2 away empty - jump
    'AND D J', //but jump only if 4 away is ground
    'NOT A T', // T = true if 1 away hole
    'OR T J', //jump also if 1 away hole
    'NOT C T', // T = true if 3 away hole
    'AND D T', // T = true if 3 away hole and 4 away ground
    'OR T J', 
    'WALK',
    ''
  ].join('\n')
  console.log(inputToIntCode);
  let pos = 0;

  const inputFn = () => {
    return Promise.resolve(inputToIntCode.charCodeAt(pos++));
  }
  const damage = []
  const outputFn = (_, rv) => {
    if (rv > 255) {
      damage.push(rv);
      console.log('got damage', damage)
    } else {
      process.stdout.write(String.fromCharCode(rv));
    }
  };
  const code = parseLine(input);
  await basicRun(code, code, inputFn, outputFn)
  return damage;
}

export const task2 = async (input: string) => {
  const inputToIntCode = [
    'NOT A J', //JUMp If 1 away hole
    'NOT B T', 
    'OR T J', //JUMP if 2 away hole
    'NOT C T', 
    'OR T J', //jump if 3 away hole
    'AND D J', //only jump if 4 away ground
    'NOT E T',
    'NOT T T', //T = true if 5 away ground
    'OR H T', // T = true if 5 away or 8 away ground
    'AND T J', // only jump if (4 away ground) and (5 away ground OR 8 away ground)
    'RUN',
    ''
  ].join('\n')
  console.log(inputToIntCode);
  let pos = 0;

  const inputFn = () => {
    return Promise.resolve(inputToIntCode.charCodeAt(pos++));
  }
  const damage = []
  const outputFn = (_, rv) => {
    if (rv > 255) {
      damage.push(rv);
      console.log('got damage', damage)
    } else {
      process.stdout.write(String.fromCharCode(rv));
    }
  };
  const code = parseLine(input);
  await basicRun(code, code, inputFn, outputFn)
  return damage;
}

