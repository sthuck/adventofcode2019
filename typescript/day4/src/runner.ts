import * as fs from 'fs';
import * as path from 'path';
import {howManyMatchPhase2,  howManyMatch, parseLine} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day4_1 = () => {
  const input = readFile('./input-1');
  const result = howManyMatch(parseLine(input[0]))
  console.log('result', result);
}
const day4_2 = () => {
  const input = readFile('./input-1');
  const result = howManyMatchPhase2(parseLine(input[0]))
  console.log('result', result);
}


day4_1();
day4_2();