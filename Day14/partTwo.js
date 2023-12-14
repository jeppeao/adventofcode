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

const tiltLine = (col, up=true) => { //up also works for left tilt if row passed
  let tilted = up ? col : col.reverse();
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
  return up ? tilted : tilted.reverse();
}

const tilt = (lines, up=true) => {
  return lines.map(line => tiltLine(line, up));
}

const tiltRound = (lines, n=1) => {
  let result = lines;
  let mem;
  for (let i=0; i<n;i++) {
    let up = tilt(result);
    let left = tilt(transpose(up));
    let down = tilt(transpose(left), false);
    let right = tilt(transpose(down), false);
    result = transpose(right);
    if (i === 1000) {
      mem = JSON.parse(JSON.stringify(result)); 
    }
    if ( i > 1000) {
      if (areSame(mem, result)) {
        let cycleLength = i - 1000;
        let turnsLeft = n - i - 1;
        let toSkip = Math.floor(turnsLeft / cycleLength);
        i = i + toSkip * cycleLength;
      }
    }
  }

  return result;
}

const transpose = (lines) => {
  return lines[0].map((_, i) => lines.map(line => line[i]));
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

const areSame = (cols1, cols2) => {
  return (cols1.flat().toString() === cols2.flat().toString());
}
const print = (cols) => {
  let rows = transpose(cols);
  for (let i=0; i<rows.length; i++) {
    let n = i.toString().padStart(2, '0');
    console.log(n, rows[i].join(''))
  }
  console.log()
}

const solve = (data) => {
  let n = 1000000000;
  const rows = parse(data);
  const cols = rows[0].map((_, i) => rows.map((line) => line[i]))
  let tilted = tiltRound(cols, n);

  const totals = tilted.map(c => calculateLoad(c));
  return totals.reduce((acc, v) => acc + v, 0);
  return;
}

readFile('./Day14/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))