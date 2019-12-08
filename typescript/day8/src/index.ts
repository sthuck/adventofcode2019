import {minBy} from 'lodash';

export const parseLine = (line: string) => {
  return line.split('').map(s => parseInt(s, 10))
}

const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

export const parseInput = (raw: number[], width: number, height: number) => {
  const layerNumber = raw.length / (width * height);
  const layers: number[][][] = [];
  for (let index = 0; index < layerNumber; index++) {
    const layer: number[][] = [];
    for (let i = 0; i < height; i++) {
      const row: number[] = [];
      for (let j = 0; j < width; j++) {
        const base = index * width * height;
        const baseRow = i * width;
        row.push(raw[base + baseRow + j]);
      }
      layer.push(row);
    }
    layers.push(layer);
  }
  return layers;
}

export const findLayerWithFewest0 = (layers: number[][][]) => {
  return minBy(layers, countLayerN(0));
}

export const countRowN = (n: number) => (row: number[]) => sum(row, item => item === n ? 1 : 0);

export const countLayerN = (n: number) => (layer: number[][]) => sum(layer, countRowN(n));

export const task1 = (input: string) => {
  const layers = parseInput(parseLine(input), 25, 6);
  const min0Layer = findLayerWithFewest0(layers);
  const count1 = countLayerN(1)(min0Layer);
  const count2 = countLayerN(2)(min0Layer);
  return count1 * count2
}

export const addPixels = (top: number, bottom: number) => {
  debugger;
  if (top !== 2) {
    return top;
  } else {
    return bottom;
  }
}

const combineRows = (a: number[], b:number[]) => {
  return a.map((_, index) => addPixels(a[index], b[index]))
}

const combineLayers = (a: number[][], b: number[][]) => {
  return a.map((_, index) => combineRows(a[index], b[index])); 
}

export const task2 = (input: string) => {
  debugger;
  const layers = parseInput(parseLine(input), 25, 6);
  const megalayer = layers.reduce(combineLayers);
  const text = megalayer.map(row => row.reduce((prev, value) => prev + (value === 2 ? 'x' : value === 1 ? '*' : ' '), ''));
  text.forEach(row => console.log(row));
}