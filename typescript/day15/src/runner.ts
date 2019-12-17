import * as fs from 'fs';
import * as path from 'path';
import {task1, task2} from './index';

const readFile = (filename: string): string =>
  // fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('');
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day15_1 = async () => {
  const input = readFile('./input-1');
  const result = await task1(input);
  console.log({result});
}

const day15_2 = async () => {
  const input = readFile('./input-1');
  const result = await task2(input);
  console.log({result});
}

// day15_1();
day15_2();


