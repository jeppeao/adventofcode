// https://adventofcode.com/2023/day/11#part2

import { readFile } from 'fs/promises'

const testData = 
`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

const sameCol = (i1, i2, cols) => {
  if (i1 % cols !== i2 % cols) return false;
  return true;
}



const parse = (data) => {
  const rowData = data.trim().split('\n').map(r => r.split(''));
  const cols = rowData[0].length;
  const elements = rowData.flat();
  const colData = rowData[0].map(
    (v, i1) => elements.filter((v, i2) => sameCol(i1, i2, cols))
  );

  return [rowData, colData];
}

const getGalaxies = (rowData, expands) => {
  const g = {};
  let count = 0;
  let exX = 0;
  let exY = 0;
  let multiple = 1000000 - 1;
  for (let [ci, row] of rowData.entries()) {
    exX = 0;
    if (expands[1][ci]) {
      exY++;
    }
    for (let [ri, e] of row.entries()) {
      if (expands[0][ri]) {
        exX++;
      }
      if (e === '#') {
        g[++count] = [ri + exX * multiple, ci + exY * multiple];
      }
    }
  }
  return g;
}

const distance = (pair, galaxies) => {
  let g1 = galaxies[pair[0]];
  let g2 = galaxies[pair[1]];
  let dy = Math.abs(g2[1]-g1[1]);
  let dx = Math.abs(g2[0]-g1[0]);
  return dx + dy;
}

const distSum = (pairs, galaxies) => {
  return pairs.map(p => distance(p, galaxies))
    .reduce((acc, val) => acc +val, 0);
}

const getPairs = (galaxies) => {
  const pairs = [];
  for (let i=0; i<galaxies.length-1; i++) {
    for (let j=i+1; j<galaxies.length; j++) {
      pairs.push([galaxies[i], galaxies[j]])
    }
  }
  return pairs;
}

const doesExpand = (rowData, colData) => {
  const expandsY = colData[0].map((val, i) => rowData[i].every(v => v === '.'));
  const expandsX = rowData[0].map((val, i) => colData[i].every(v => v === '.'));
  return [expandsX, expandsY];
}

const solve = (data) => {
  const [rowData, colData] = parse(data);
  const expands = doesExpand(rowData, colData);
  const gals = getGalaxies(rowData, expands);
  const pairs = getPairs(Object.keys(gals));
  const sum = distSum(pairs, gals);
  return sum;
}

readFile('./Day11/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))