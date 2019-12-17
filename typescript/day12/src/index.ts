import {range, zip} from 'lodash';

type Point = [number, number, number];
type Planets = Planet[];
interface Planet {
  id: number;
  pos: Point;
  velocity: Point
}
const printTriplet = (arr) => `x=${arr[0]}, y=${arr[1]}, z=${arr[2]}`
const printPlanet = (planet: Planet) => `pos=<${printTriplet(planet.pos)}>, vel=<${printTriplet(planet.velocity)}>`
const sum = <T>(arr: T[], howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

export const parseInput = (lines: string[]): Planets => {
  return lines.map((line, i) => {
    const [x, y, z] = parseLine(line);
    return {
      id: i,
      pos: [x, y, z],
      velocity: [0, 0, 0]
    }
  })
}

const applyGravitySingle = ([aPos, aVelo], [bPos, bVelo]) => {
  if (aPos === bPos) {
    return [aVelo, bVelo];
  }
  if (aPos > bPos) {
    return [aVelo - 1, bVelo + 1];
  }
  return [aVelo + 1, bVelo - 1]
}

const applyGravity = (planets: Planets) => {
  planets.forEach(planetA => {
    planets.forEach(planetB => {
      if (planetA.id <= planetB.id) {
        return;
      }
      const [aVelocity, bVelocity] = zip(...range(3).map(i => {
        const [a, b] = applyGravitySingle([planetA.pos[i], planetA.velocity[i]], [planetB.pos[i], planetB.velocity[i]]);
        return [a, b]
      }));
      planetA.velocity = aVelocity as any;
      planetB.velocity = bVelocity as any;
    });
  });
}

const applyVelocity = (planets: Planets) => {
  planets.forEach(planet => {
    range(3).forEach(i => {
      planet.pos[i] += planet.velocity[i];
    })
  })
}


export const parseLine = (line: string) => {
  const r = /-?\d+/g;
  const [x, y, z] = range(3).map(() => r.exec(line)[0]).map(s => parseInt(s, 10));
  return [x, y, z];
}

const planetEnergy = (planet: Planet) => {
  const kEnergy = sum(planet.pos.map(v => Math.abs(v)), v => v);
  const pEnergy = sum(planet.velocity.map(v => Math.abs(v)), v => v);
  return kEnergy * pEnergy;
}

export const task1 = (input: string[], steps = 1000) => {
  const planets = parseInput(input);
  range(steps).forEach(() => {
    // console.log(planets.map(p => printPlanet(p)).join('\n'), '\n\n');
    applyGravity(planets);
    applyVelocity(planets);
  });
  return sum(planets, planetEnergy);
}

const getState = (planets: Planets, axis: number) => {
  return planets.map(p => `${p.pos[axis]},${p.velocity[axis]}`).join('|');
}

function gcd(a, b) {
  let t;
  while (b !== 0) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export const task2 = (input: string[]) => {
  const planets = parseInput(input);
  const prevState = [new Map(), new Map(), new Map()]
  const foundRepeat = [null, null, null];
  for (let i = 0; i < Infinity; i++) {
    if (foundRepeat.every(v => !!v)) {
      break;
    }
    applyGravity(planets);
    applyVelocity(planets);
    const currentStates = range(3).map(i => getState(planets, i));
    range(3).forEach(axis => {
      if (!foundRepeat[axis]) {
        if (prevState[axis].has(currentStates[axis])) {
          const prevIteration = prevState[axis].get(currentStates[axis]);
          foundRepeat[axis] = [prevIteration, i];
          console.log(`repeating for axis ${axis}, prev: ${prevIteration}, current: ${i}`);
        } else {
          prevState[axis].set(currentStates[axis], i);
        }
      }
    })
  };
  
  const gaps = range(3).map(axis => foundRepeat[axis][1] - foundRepeat[axis][0]);
  const lcm1 = gaps[0] * gaps[1] / gcd(gaps[0], gaps[1]);
  const lcm2 = lcm1 * gaps[2] / gcd(lcm1, gaps[2]);
  return lcm2;
}

