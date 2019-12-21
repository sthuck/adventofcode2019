import * as fs from 'fs';
import * as path from 'path';
import {task1} from './index';
import {task2} from './index-2';

const readFile = (filename: string): string =>
  // fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('');
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day20_1 = async () => {
  const input = readFile('./input-1');
  const result = task1(input);
  console.log({result});
}

const day20_2 = async () => {
  const input = readFile('./input-1');
  const result = task2(input);
  console.log({result});
}

// day20_1();
day20_2();


