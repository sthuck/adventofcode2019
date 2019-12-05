const compute = (verb: number, noun: number) => {
  return (5 + (verb + (3 + (5 * (1 + ((5 + ((((4 + (1 + (4 * ((((1 + (1 + (3 * (1 + (((2 * ((5 * (2 + ((4 * (3 + (2 + (((5 * noun) + 4) + 5)))) + 2))) + 2)) * 2) * 5))))) + 2) + 2) + 1)))) + 3) * 4) + 3)) + 3))))))
}

const findVerbNoun = () => {
  for (let verb = 0; verb <= 99; verb++) {
    for (let noun = 0; noun <= 99; noun++) {
      if (compute(verb, noun) === 19690720) {
        return {verb, noun};
      }
    }
  }
}
console.log(findVerbNoun());