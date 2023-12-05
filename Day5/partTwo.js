// https://adventofcode.com/2023/day/5#part2

const { readFile } = require('fs/promises');

const testData =
`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`

const seedParserRe = /(?<=seeds:)(\s\d+)+/
const mapsParserRe = /map:(\s\d+)+/g

const getSeeds = (data) => {
  return data.match(seedParserRe)[0]
    .trim()
    .split(' ')
    .map(n => parseInt(n))
    .reduce(
      (acc, val, i, a) => i % 2 === 0 ? [...acc, [val, a[i+1]]] : acc,[]
    ); // conbining every other element with the next
}

const getMaps = (data) => {
  const maps = [];
  for (match of data.matchAll(mapsParserRe)) {
    maps.push(match[0] // the matching string
      .split(":")[1]
      .trim()
      .split("\n") // divide string into each triplet line
      .map(m => m.split(' ').map(n => parseInt(n))) 
    )
  }
  return maps;
}

// to save computations, look for the longest stretches of seed values that 
// are guaranteed to end in higher dest numbers than the first
const convert = (seed, mapRanges) => {
  let val = seed[0];
  let result = val;
  let resultRange = seed[1]
  let found = false;
  for (m of mapRanges) {
    dest = m[0];
    source = m[1];
    length = m[2];
    if (val >= source && val <= source + length - 1) {
      result = dest - source + val;
      found = true;
      if (resultRange + val - 1 > source + length - 1) {
        resultRange = (source + length) - val;
        
      }
      break;
    }
  }
  if (!found) { 
    for (m of mapRanges) {
      dest = m[0];
      source = m[1];
      length = m[2];
      if (source > val && source + length - 1 <= val + resultRange - 1) {
        resultRange = source - val;
      }
    }
  }
  return [result, resultRange];
}

const findLowest = (seeds, maps) => {
  const q = seeds.reverse();
  const lowest = [];
  while (q.length > 0) {
    
    let seed = q.pop();
    let curSeed = seed;
    for (let map of maps) {
      curSeed = convert(curSeed, map);
    }
    lowest.push(curSeed[0])
    if (curSeed[1] !== seed[1]) {
      let newSource = seed[0] + curSeed[1];
      let newRange = seed[1] - curSeed[1];
      q.push([newSource, newRange]);
    }
  }
  return lowest;
}

const solve = (data) => {
  const seeds = getSeeds(data);
  const maps = getMaps(data);
  const lowest = findLowest(seeds, maps);
  return lowest.reduce((acc, val) => val < acc ? val : acc, lowest[0])
}

readFile('./Day5/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res));
