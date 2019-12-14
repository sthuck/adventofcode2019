import * as fs from 'fs';
import * as path from 'path';
import {task1, task2} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');
  // fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day14_1 = async () => {
  const input = readFile('./input-1');
  const result = task1(input);
  console.log({result});
}

const day14_2 = async () => {
  const input = readFile('./input-1');
  const result = task2(input);
  console.log({result});
}

day14_1();
day14_2();


