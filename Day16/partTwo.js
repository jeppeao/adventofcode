// https://adventofcode.com/2023/day/16#part2

import { readFile } from 'fs/promises'

const testData = 
`.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....`

const parse = (data) => {
  const parsed = '';
  return parsed;
}
const solve = (data) => {
  const parsed = parse(data);
  return parsed;
}

readFile('./Day16/puzzleInput.txt', 'utf-8')
  .then(file => solve(testData))
  .then(res => console.log(res))