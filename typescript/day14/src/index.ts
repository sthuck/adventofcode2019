import {cloneDeep} from 'lodash';
import * as assert from 'assert';

interface Item {
  name: string;
  amount: number
}

interface Recipe {
  need: Item[],
  result: Item
}

const strToItem = (s: string) => {
  const [amountS, name] = s.split(' ');
  return {
    amount: parseInt(amountS, 10),
    name
  };
}
export const parseLine = (line: string): Recipe => {
  const [needList, result] = line.split(' => ');
  const resultParsed = strToItem(result)
  const need = needList.split(', ').map(strToItem);
  return {need, result: resultParsed};
}

export const parseInput = (lines: string[]) => {
  const map: Record<string, Recipe> = {};
  lines.forEach(l => {
    const {need, result} = parseLine(l);
    map[result.name] = {need, result}
  });
  return map;
}

export const make = (bank: Record<string, number>, getRecipeFor: (item: string, howMuch: number) => Recipe) => (howMuch: number, what: string) => {
  const recipe = getRecipeFor(what, howMuch);
  const need = recipe.need;
  need.forEach(item => {
    const howMuchNeeded =  item.amount - (bank[item.name] || 0);
    if (howMuchNeeded > 0) {
      make(bank, getRecipeFor)(howMuchNeeded, item.name);
    }
    assert((bank[item.name] || 0) >= item.amount, `needed ${item.amount} for ${item.name}, have only ${bank[item.name]}`);
    bank[item.name] = bank[item.name] - item.amount;
  });
  bank[what] = (bank[what] || 0) + recipe.result.amount;
}

export const task1 = (input: string[], howMuchFuel = 1) => {
  const bank: Record<string, number> = {};
  const recipes = parseInput(input);
  return makeFuel(recipes, bank, howMuchFuel);
}

export const task2 = (input: string[]) => {
  const recipes = parseInput(input);

  const prevOre = undefined;
  let fuelRequired = 2757000; //based on task 1 result
  while(true) {
    const howMuchOre =  makeFuel(recipes, {}, fuelRequired);
    console.log('checking', fuelRequired)
    if (howMuchOre > 1000000000000) {
      fuelRequired -=1000;
      break;
    } else {
      fuelRequired+=1000;
    }
  }
  while(true) {
    const howMuchOre =  makeFuel(recipes, {}, fuelRequired);
    console.log('checking', fuelRequired)
    if (howMuchOre > 1000000000000) {
      return fuelRequired -1;
    } else {
      fuelRequired+=1;
    }
  }
}

function makeFuel(recipes: Record<string, Recipe>, bank: Record<string, number>, howMuchFuel: number) {
  let oreNeeded = 0;
  const getRecipeFor = (itemName: string, howMuch: number): Recipe => {
    if (itemName === 'ORE') {
      oreNeeded += howMuch;
      return {need: [], result: {amount: howMuch, name: 'ORE'}};
    }
    const base = recipes[itemName];
    const mult = Math.ceil(howMuch / base.result.amount);
    const need = base.need.map(({amount, name}) => ({name, amount: amount * mult}));
    return {result: {amount: base.result.amount * mult, name: base.result.name}, need};
  };
  make(bank, getRecipeFor)(howMuchFuel, 'FUEL');
  return oreNeeded;
}

