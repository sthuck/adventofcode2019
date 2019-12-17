export const parseLine = (line: string) => {
  const [parent, name] = line.split(')');
  return {parent, name, children: []};
}

export const parseInput = (lines: string) => {
  return lines.split('\n').map(parseLine);
}

type Orbit = ReturnType<typeof parseLine>;

export const buildTree = (orbits: Orbit[]) => {
  const tree: Record<string, Orbit> = {};
  orbits.forEach(orbit => tree[orbit.name] = orbit);
  tree['COM'] = {name: 'COM', children: [], parent: null}
  Object.values(orbits).forEach(orbit => {
    if (orbit.parent) {
      
      tree[orbit.parent].children.push(orbit.name);
    }
  })
  return tree;
}

const sum = <T>(arr: T[]) => (howFn: (item: T) => number) => arr.reduce((prev, item) => prev + howFn(item), 0);

const howManyOrbits = (tree: Record<string, Orbit>) => {
  const cache: Record<string, number> = {};
  const countParents = (planet: string) => {
    if (cache[planet] !== undefined) {
      return cache[planet];
    }

    const orbit = tree[planet];
    if (orbit === undefined || orbit.name === 'COM') {
      cache[planet] = 0;
      return 0;
    }
    const value = 1 + countParents(orbit.parent);
    cache[planet] = value;
    return value;
  }
  return sum(Object.keys(tree))(countParents);
}

export const task1 = (lines: string) => {
  const orbits = parseInput(lines);
  const tree = buildTree(orbits);
  return howManyOrbits(tree);
}

export const task2 = (lines: string) => {
  const orbits = parseInput(lines);
  const tree = buildTree(orbits);
  const entryPoint = tree['YOU'].parent;
  const finishPoint = tree['SAN'].parent;
  return traverseTree(tree, entryPoint, finishPoint);
}


export const traverseTree = (tree: Record<string, Orbit>, start: string, end: string, visited = new Set<string>()) => {
  if (visited.has(start)) {
    return -1;
  }

  visited.add(start);
  if (start === end) {
    return 0;
  }
  const orbit = tree[start];
  let value = orbit.parent ? traverseTree(tree, orbit.parent, end, visited) : -1;
  if (value !== -1) {
    return value + 1;
  }
  for (const child of orbit.children) {
    value = traverseTree(tree, child, end, visited);
    if (value !== -1) {
      return value + 1;
    }
  }
  return -1;
}
