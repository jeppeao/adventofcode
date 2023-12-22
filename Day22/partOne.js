// https://adventofcode.com/2023/day/22#part1

import { readFile } from 'fs/promises'

const testData = 
`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`

const parse = (data) => {
  const parsed = data.trim()
    .split('\n')
    .map(b => b.split('~').map(c => c.split(',').map(Number)));
  return parsed.sort(sortByZ);
}

const sortByZ = (a, b) => {
  return a[0][2] - b[0][2];
}

const brickCoords = (brick) => {
  let s = brick[0];
  let e = brick[1];
  const coords = [[...s]];
  for (let c=0; c<3; c++) {
    let cur = [...s];
    while (cur[c] < e[c]) {
      cur[c]++;
      coords.push([...cur])
    }
  }
  return coords;
}

const getBricks = (parsed) => {
  let b = {};
  for (let [i, brick] of parsed.entries()) {
    b[i] = brickCoords(brick);
  }
  return b;
}

const formMap = (brickCoords) => {
  const map = [];
  for (let x=0; x<10; x++) {
    map[x] = new Array();
    for (let y=0; y<10; y++) {
      map[x][y] = new Array();
    }
  }

  for (let brick in brickCoords) {
    for (let [x, y, z] of brickCoords[brick]) {
      map[x][y][z] = brick
    }
  }
  return map;
}

const findSupport = (brick, brickCoords, map) => {
  let support = new Set();
  for (let c of brickCoords[brick]) {
    if (c[2]-1 === 0) {
      support.add('g')
    }
    else {
      let down = map[c[0]][c[1]][c[2]-1];
      if (down && down !== brick) {
        support.add(down);
      }
    }
  }
  return [...support]
}

const findSupportees = (brick, brickCoords, map) => {
  let support = new Set();
  for (let c of brickCoords[brick]) {
    let down = map[c[0]][c[1]][c[2]+1];
    if (down && down !== brick) {
      support.add(down);
    }
  }
  return [...support];
}

const moveBrickDown = (brick, brickCoords, map) => {
  for (let c of brickCoords[brick]) {
    map[c[0]][c[1]][c[2]] = undefined;
  }
  let newCoords = [];
  for (let c of brickCoords[brick]) {
    newCoords.push([c[0], c[1], c[2]-1])
    map[c[0]][c[1]][c[2]-1] = brick;
  }
  brickCoords[brick] = newCoords;
}

const dropBrick = (brick, brickCoords, map) => {
  let support = findSupport(brick, brickCoords, map);
  while (support.length === 0) {
    moveBrickDown(brick, brickCoords, map)
    support = findSupport(brick, brickCoords, map);
  }
}

const solve = (data) => {
  const parsed = parse(data);
  const brickCoords = getBricks(parsed);
  const map = formMap(brickCoords);
  for (let brick in brickCoords) {
    dropBrick(brick, brickCoords, map);
  }
  let safe = [];
  for (let brick in brickCoords) {
    let supportees = findSupportees(brick, brickCoords, map);
    if ( supportees.length === 0 
      || supportees.every(b => findSupport(b, brickCoords, map).length > 1)) {
        safe.push(brick)
    }
  }

  return safe.length;
}

readFile('./Day22/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))