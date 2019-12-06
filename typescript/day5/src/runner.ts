import * as fs from 'fs';
import * as path from 'path';
import {runPhase1, parseLine} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day5_1 = async () => {
  const input = readFile('./input-1');
  const result = await runPhase1(parseLine(input[0]))
}

day5_1();
