// https://adventofcode.com/2023/day/10#part1

import { readFile } from 'fs/promises'

const testData = 
`..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`;
const testData2 = 
`.....
.S-7.
.|.|.
.L-J.
.....`;

const connectsTo = (i, type, cols, ni) => {
  const left = sameRow(i, i-1, cols, ni) ? [i-1] : [];
  const right = sameRow(i, i+1, cols, ni) ? [i+1] : [];
  const up = isValid(i-cols, ni) ? [i -cols] : [];
  const down = isValid(i+cols, ni) ? [i+cols] : [];

  switch (type) {
    case '|': return down.concat(up);
    case '-': return left.concat(right);
    case 'L': return right.concat(up);
    case 'J': return left.concat(up);
    case '7': return down.concat(left);
    case 'F': return down.concat(right);
    case '.': return [];
    case 'S': return down.concat(up, left, right);
   }
}

const isValid = (idx, nElements) => {
  return (idx > 0 && idx < nElements);
}

const sameRow = (i1, i2, cols, ni) => {
  if (!isValid(i1, ni) || !isValid(i2, ni)) return false;
  if (Math.floor(i1 / cols) !== Math.floor(i2 / cols)) return false;
  return true;
}

const sameCol = (i1, i2, cols, ni) => {
  if (!isValid(i1, ni) || !isValid(i2, ni)) return false;
  if (i1 % cols !== i2 % cols) return false;
  return true;
}

const parseToMatrix = (data) => {
  const elements =  data.trim().split('\n').map(r => r.split('')).flat();
  const cols = data.trim().split('\n')[0].length;
  return [cols, elements]
}

const loopLength = (elements, conns) => {
  let start = elements.indexOf('S');
  let q = [start];
  let visited = [];
  while (q.length > 0) {
    let cur = q.pop();
    visited.push(cur);
    for (let conn of conns[cur]) {
      if (
        conns[conn].includes(cur) && 
        !visited.includes(conn) &&
        !q.includes(conn)
      ){
        q.push(conn);
      }
    }
  }
  return visited.length / 2;
}

const solve =(data) => {
  const [cols, elements] = parseToMatrix(data);
  const ni = elements.length;
  const conns = elements.map((e, i) => connectsTo(i, e, cols, ni));
  const len = loopLength(elements, conns);
  return len;
}


readFile('./Day10/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))