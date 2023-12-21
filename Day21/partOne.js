// https://adventofcode.com/2023/day/21#part1

import { readFile } from 'fs/promises'

const testData = 
`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`

const parse = (data) => {
  const rows = data.trim()
    .split('\n')
    .map(r => r.split(''));
  const nCols = rows[0].length;
  const items = rows.flat();
  return [items, nCols];
}

const sameRow = (p1, p2, cols) => {
  return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
}

const validNextSteps = (pos, items, nCol) => {
  let valid = [];
  if (pos - nCol >= 0) {
    valid.push(pos - nCol);
  }
  if (pos + nCol < items.length) {
    valid.push(pos + nCol)
  }
  if (sameRow(pos, pos-1, nCol)) {
    valid.push(pos - 1);
  }
  if (sameRow(pos, pos+1, nCol)) {
    valid.push(pos + 1);
  }
  return valid.filter(pos => items[pos] !== '#')
}

const nextSteps = (curPos, items, nCol) => {
  let nextSteps = [];
  for (let pos of curPos) {
    nextSteps = nextSteps.concat(
      validNextSteps(pos, items, nCol)
    )
  }
  return nextSteps;
}

const takeSteps = (nSteps, start, items, nCol) => {
  let cur = [start];
  for (let i=0; i<nSteps; i++) {
    cur = [...new Set(nextSteps(cur, items, nCol))];
  }

  return cur;
}

const solve = (data) => {
  const [items, nCol] = parse(data);
  let start = items.indexOf('S');
  let next = takeSteps(64, start, items, nCol)
  // let map = markSteps(items, next)
  // printTiles(map, nCol)
  return next.length;
}

const markSteps = (items, steps) => {
  return items.map((val, i) => steps.includes(i) ? 'O' : val);
}

const printTiles = (tiles, cols) => {
  const maxDigits = tiles.length.toString().length;
  for (let i=cols; i<=tiles.length; i+=cols) {
    let row = tiles.slice(i-cols, i).join('');
    console.log((i-cols).toString().padStart(maxDigits, '0'), row);
  }
}

readFile('./Day21/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))