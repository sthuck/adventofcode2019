
const parseLine = (line: string): number =>
  parseInt(line, 10);

const computeMass = (n: number) => Math.floor(n/3) - 2
const onlyPositive = (n: number) => n >= 0 ? n : 0;

const composeFn = <T extends Array<any>, R, R2>(f: (...args: T) => R, g: (args: R) => R2) => (...args: T): R2 => {
  const rv = f(...args);
  return Array.isArray(rv) ? (g as any)(...rv) : g(rv);
};

const computeMassOnlyPositive = composeFn(computeMass, onlyPositive)
const computeMass2  = (mass: number) => {
  let total = 0;
  while (mass > 0) {
    mass = computeMassOnlyPositive(mass)
    total += mass;
  }
  return total;
}

const sum = (n: number[]) => n.reduce((total, value) => total + value)


export const computeMassAll = (input: string[]) => sum(input.map(parseLine).map(computeMass))
export const computeMassWithFuel = (input: string[]) => sum(input.map(parseLine).map(computeMass2))
