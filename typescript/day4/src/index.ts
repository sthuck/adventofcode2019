
export const parseLine = (line: string): {low: number, high: number} => {
  const a = line.split('-').map(n => parseInt(n, 10));
  return {low: a[0], high: a[1]}
}


export const criteriaTwoDigits = (n: number): boolean => {
  const nStr = '' + n;
  for (let i = 1; i < nStr.length; i++) {
    if (nStr[i] === nStr[i-1]) {
      return true
    }
  }
  return false;
}

export const criteriaTwoDigitsPhase2 = (n: number): boolean => {
  const nStr = '' + n;
  for (let i = 1; i < nStr.length; i++) {
    if (nStr[i] === nStr[i-1] && (i-2 < 0 || (nStr[i] !== nStr[i -2])) && (i + 1>= nStr.length || nStr[i] !== nStr[i+1])) {
      return true
    }
  }
  return false;
}

export const neverDecreases = (n: number): boolean => {
  const nStr = '' + n;
  for (let i = 1; i < nStr.length; i++) {
    if (nStr[i] < nStr[i-1]) {
      return false
    }
  }
  return true;
}

export const howManyMatch = (r: {low: number, high: number}) => {
  let count = 0;
  for (let i = r.low; i <= r.high; i++) {
    if ([criteriaTwoDigits, neverDecreases].every(fn => fn(i))) {
      count++
    }
  }
  return count;
}
export const howManyMatchPhase2 = (r: {low: number, high: number}) => {
  let count = 0;
  for (let i = r.low; i <= r.high; i++) {
    if ([criteriaTwoDigitsPhase2, neverDecreases].every(fn => fn(i))) {
      count++
    }
  }
  return count;
}