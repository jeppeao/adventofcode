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

const testData3 = 
`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`

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

const isInside = (i, elements, cols, loop) => {
  let col = Math.floor(i / cols);
  let first = cols * col;
  let vert = ['|', 'J', 'L'];
  let vertCount = 0;
  for (let j=first; j<i; j++) {
    if(loop.includes(j) 
      && vert.includes(elements[j])
      && !loop.includes(i)
    ) {
      vertCount++;
    }
  }
  return vertCount % 2 !== 0;
}

const solve =(data) => {
  const [cols, elements] = parseToMatrix(data);
  const ni = elements.length;
  const conns = elements.map((e, i) => connectsTo(i, e, cols, ni));
  const loop = findLoop(elements, conns);
  const outConn = elements.map(
    (e, i) => connToOutside(i, elements, loop, cols)
  );
  const inside = elements.map((e, i) => isInside(i, elements, cols, loop));
  return inside.filter(Boolean).length;
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
  .then(file => solve(file))
  .then(res => console.log(res))