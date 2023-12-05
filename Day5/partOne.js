// https://adventofcode.com/2023/day/5#part1

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
    .map(n => parseInt(n));
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

const convert = (seed, mapRanges) => {
  let val = seed;
  for (m of mapRanges) {
    dest = m[0];
    source = m[1];
    length = m[2];
    if (val >= source && val <= source + length - 1) {
      return dest - source + val;
    }
  }
  return val;
}

const convertSerially = (seed, maps) => {
  return maps.reduce((cur, mapRanges) => convert(cur, mapRanges), seed);
}

const lowestLocation = (data) => {
  const seeds = getSeeds(data);
  const maps = getMaps(data);
  const locations = seeds.map(seed => convertSerially(seed, maps));
  return locations.reduce((acc, val) => val < acc ? val : acc, locations[0]);
}

readFile('./Day5/puzzleInput.txt', 'utf-8')
  .then(file => lowestLocation(file))
  .then(res => console.log(res));





