// https://adventofcode.com/2023/day/14#part1

import { readFile } from 'fs/promises'

const testData = 
`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`

const parse = (data) => {
  const parsed = data.trim().split('\n').map(line => line.split(''));
  return parsed;
}

const tiltUp = (col) => {
  let tilted = col;
  let free = null;
  for (let i=0; i<col.length; i++) {
    if (tilted[i] === '#') free = null;
    if (tilted[i] === '.' && free === null) free = i;
    if (tilted[i] === 'O' && free !== null) {
      tilted[free] = 'O';
      tilted[i] = '.';
      free++;
    }
  }
  return tilted;
}

const calculateLoad = (col) => {
  let load = col.length;
  let totalLoad = 0;
  for (let i=0; i<col.length; i++) {
    if (col[i] === 'O') totalLoad += load;
    load--;
  }
  return totalLoad;
}

const solve = (data) => {
  const rows = parse(data);
  const cols = rows[0].map((_, i) => rows.map((line) => line[i]))
  const totals = cols.map(c => calculateLoad(tiltUp(c)));
  return totals.reduce((acc, v) => acc + v, 0);
}

readFile('./Day14/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))