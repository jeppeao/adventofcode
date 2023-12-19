// https://adventofcode.com/2023/day/17#part1

import { readFile } from 'fs/promises'

const testData = 
`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`

const parse = (data) => {
  const rows = data.trim()
    .split(/\s/);
  const nCol = rows.length;
  const nRow = rows[0].length;
  const items = rows.map(r => r.split('').map(Number)).flat();
  const n = items.length;
  return [items, n, nCol, nRow];
}

const findPaths = (items, nCol, n) => {
  const dirs = {
    '-1': 'L',
    '1': 'R',
    [-nCol]: 'U',
    [nCol]: 'D',
  };
  const minDist = items.map((v, i) => {
    return {
      'U': [null, null, null],
      'D': [null, null, null],
      'L': [null, null, null],
      'R': [null, null, null],
    }
  });
  let q = [{pos: 0, dir: '', total: 0, steps: 0}];
  while (q.length > 0) {
    let min = q[0].total;
    let minIdx = 0;
    for (let i=0; i<q.length; i++) {
      if (q[i].total < min) {
        min = q[i].total;
        minIdx = i;
      }
    }
    let cur = q[minIdx];
    q = [...q.slice(0, minIdx), ...q.slice(minIdx+1)];
    let allowed = allowedDestinations(cur.pos, nCol, n, cur.dir, cur.steps);
    for (let pos of allowed) {
      let dir = dirs[pos - cur.pos];
      let steps = dir === cur.dir ? cur.steps + 1 : 1; 
      let total = items[pos] + cur.total;
      if (pos === n-1) {
        minDist[pos][dir][steps-1] = total;
        return minDist;
      }
      if (!minDist[pos][dir][steps-1] || minDist[pos][dir][steps-1] > total) {
        minDist[pos][dir][steps-1] = total;
        q.push({pos, dir, total, steps});
      }
    }
  }
  
  return minDist;
}

const solve = (data) => {
  const [items, n, nCol, nRow] = parse(data);
  const minDist = findPaths(items, nCol, n);
  let min;
  for (let dir of ['U', 'D', 'L', 'R']) {
    for (let val of minDist[n-1][dir]) {
      if (val && (!min || val < min)) {
        min = val;
      }
    }
  }
  return min;
}

const sameRow = (p1, p2, cols) => {
  return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
}

const printTiles = (tiles, cols) => {
  for (let i=cols; i<=tiles.length; i+=cols) {
    let row = tiles.slice(i-cols, i).join('');
    console.log(row);
  }
}

const allowedDestinations = (pos, nCol, n, dir, consecutive) => {
  let dest = [];
  let maxSteps = 3;
  if (
    pos-nCol > 0 
    && dir !== 'D'
    && (dir !== 'U' || consecutive < maxSteps)
    ) {
    dest.push(pos-nCol);
  }
  if (
    pos+nCol < n 
    && dir !== 'U'
    && (dir !== 'D' || consecutive < maxSteps)
    ) {
    dest.push(pos+nCol);
  }
  if (
    sameRow(pos+1, pos, nCol) 
    && dir !== 'L'
    && (dir !== 'R' || consecutive < maxSteps)
    ) {
    dest.push(pos+1);
  }
  if (
    sameRow(pos-1, pos, nCol) 
    && dir !== 'R'
    && (dir !== 'L' || consecutive < maxSteps)
    ) {
    dest.push(pos-1);
  }
  return dest;
}



readFile('./Day17/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))