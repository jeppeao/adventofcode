// https://adventofcode.com/2023/day/11#part2

import { readFile } from 'fs/promises'

const testData = 
``


readFile('./Day11/puzzleInput.txt', 'utf-8')
  .then(file => solve(testData))
  .then(res => console.log(res))