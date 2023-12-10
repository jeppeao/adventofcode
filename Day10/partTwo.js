// https://adventofcode.com/2023/day/10#part1

import { readFile } from 'fs/promises'

const testData = 
`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`;
const testData2 = 
`..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`;

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

const connToOutside = (i, elements, loop, cols) => {
  let q = [i];
  let visited = [];
  let ni = elements.length;
  while (q.length > 0) {
    let cur = q.pop();
    if (loop.includes(cur)) continue;
    if (cur % cols === 0 || cur % cols === cols-1) return true;
    if (cur < cols || cur >= elements.length - cols) return true;
    visited.push(cur);
    for (let c of [cur-1, cur+1, cur+cols, cur-cols]) {
      if (isValid(c, ni) && (!visited.includes(c)) && (!loop.includes(c))) {
        q.push(c);
      }
    }
  }
  return false;
}

const findLoop = (elements, conns) => {
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
  return visited;
}

const sqConns = (i, j, elements, loop) => {
  const conns = [];
  const exits = [];
  let UL = i * cols + j;
  let UR = i * cols + j + 1;
  let DL = (i+1) * cols + j;
  let DR = (i+1) * cols + j + 1;
  let TUL = loop.includes(UL) ? elements[i * cols + j] : '.';
  let TUR = loop.includes(UR) ? elements[i * cols + j + 1] : '.';
  let TDL = loop.includes(DL) ? elements[(i+1) * cols + j] : '.';
  let TDR = loop.includes(DR) ? elements[(i+1) * cols + j + 1] : '.';
  if (TUL === '.') exits.push(UL);
  if (TUR === '.') exits.push(UR);
  if (TDL === '.') exits.push(DL);
  if (TDR === '.') exits.push(DR);
  if (!['F', '-', '.'].includes(TUL) 
    && !['7', '-', '.'].includes(TUR)) conns.push();
}

const squeezePoints = (elements, loop, cols) => {
  let rows = elements.length / cols;
  let sqCols = cols - 1;
  let sqRows = rows - 1;
  let sqLen = cols * rows;
  const sqConn = [];

  for (let i=0; i<sqRows; i++) {
    for (let j=0; j<sqCols; j++) {
      let conns = [];

      
      console.log(i, j, UL, UR, DL, DR)
    }
    
  }
}

const solve =(data) => {
  const [cols, elements] = parseToMatrix(data);
  const ni = elements.length;
  const conns = elements.map((e, i) => connectsTo(i, e, cols, ni));
  const loop = findLoop(elements, conns);
  const outConn = elements.map(
    (e, i) => connToOutside(i, elements, loop, cols)
  );
  squeezePoints(elements, loop, cols);
  const inside = elements.map((e, i) => !outConn[i] && !loop.includes(i));
  // print(inside, cols, ni)
  // print (outConn, cols, ni)
  // printSelected(loop, elements, cols, ni)
}

const printSelected = (selected, elements, cols, ni) => {
  const sel = elements.map((e, i) => selected.includes(i));
  print (sel, cols, ni)
}

const print = (elements, cols, ni) => {
  let row = '';
  for (let i=0; i<=ni; i++) {
    if (i % cols === 0) {
      console.log(i-cols, row);
      row = '';
    } 
    row += (elements[i] ? '+' : '-')
  }
}

readFile('./Day10/puzzleInput.txt', 'utf-8')
  .then(file => solve(testData2))
  .then(res => console.log(res))