// https://adventofcode.com/2023/day/18#part2

import { readFile } from 'fs/promises'

const testData = 
`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`

const parse = (data) => {
  const parsed = '';
  return parsed;
}
const solve = (data) => {
  const parsed = parse(data);
  return parsed;
}

readFile('./Day18/puzzleInput.txt', 'utf-8')
  .then(file => solve(testData))
  .then(res => console.log(res))