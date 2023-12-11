// https://adventofcode.com/2023/day/11#part1

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

const expand = (elems, rowData, colData) => {
  let expRow = [];
  let expCol = [];

  for (let i=0; i<rowData.length; i++) {
    expCol = expCol.concat(
      colData[i].every(v => v === '.') ? [colData[i], colData[i]] : [colData[i]]
    );
  }
  let cols = colData.length;
   for (let i=0; i<expCol[0].length; i++) {
    let r = expCol.map(col => col[i]);
    expRow = expRow.concat(
      r.every(v => v === '.') ? [r, r] : [r]
    );
   }

  return [expRow, expCol];
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

const getGalaxies = (rowData) => {
  const g = {};
  let count = 0;
  for (let [ci, row] of rowData.entries()) {
    for (let [ri, e] of row.entries()) {
      if (e === '#') {
        g[++count] = [ri, ci];
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

const solve = (data) => {
  const [rowData, colData] = parse(data);

  const elements = rowData.flat();
  const len = elements.length;
  const rows = rowData[0].length;
  const cols = rowData[0].length;
  const [expRow, expCol] = expand(elements, rowData, colData); 
  const gals = getGalaxies(expRow);
  const pairs = getPairs(Object.keys(gals));
  const sum = distSum(pairs, gals);
  return sum;
}

readFile('./Day11/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))