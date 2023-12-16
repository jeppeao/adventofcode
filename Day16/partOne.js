// https://adventofcode.com/2023/day/16#part1

import { readFile } from 'fs/promises'

const testData = 
String.raw`.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....`;

const parse = (data) => {
  const lines  = data.trim().split('\n');
  const cols = lines[0].length;
  const parsed = lines.map(line => line.split('')).flat();
  return [parsed, cols];
}

// direction = U, D, L R
const getDirections = (cur, tile) => {
  if (tile === '.') return [cur];
  if (tile === '-') {
    if (['L','R'].includes(cur)) return [cur];
    return ['L', 'R'];
  }
  if (tile === '|') {
    if (['U', 'D'].includes(cur)) return [cur];
    return ['U', 'D'];
  }
  if (tile === '\\') {
    if (cur === 'U') return ['L'];
    if (cur === 'D') return ['R'];
    if (cur === 'R') return ['D'];
    if (cur === 'L') return ['U'];
  }
  if (tile === '/') {
    if (cur === 'U') return ['R'];
    if (cur === 'D') return ['L'];
    if (cur === 'R') return ['U'];
    if (cur === 'L') return ['D'];
  }
}

const nextPos = (pos, dir, cols, n) => {
  let nextPos;
  if (dir === 'U') nextPos = pos - cols;
  if (dir === 'D') nextPos = pos + cols;
  if (dir === 'L') nextPos = pos - 1;
  if (dir === 'R') nextPos = pos + 1;

  if (!validPos(nextPos, n)) nextPos = false; 
  if (['L', 'R'].includes(dir) && !sameRow(pos, nextPos, cols)) {
    nextPos = false;
  }
  return nextPos;
}

const traversedTiles = (tiles, cols, starting) => {

  let traversed = new Set();
  let q = [starting];
  let seen = Object.fromEntries(Array(tiles.length).fill(0).map(e  => []).entries());
  seen[starting.pos] = [starting.dir];
  while (q.length > 0) {
    let { pos, dir } = q.pop();
    
    let nextDirs = getDirections(dir, tiles[pos]);
    for (let nextDir of nextDirs) {
      let next = nextPos(pos, nextDir, cols, tiles.length);
      if (next !== false && !seen[next].includes(nextDir)) {
        seen[next].push(nextDir);
        q.push({pos: next, dir: nextDir})
      }
    }
  }
  return seen;
}

const getStartingPositions = (cols, n) => {
  const pos = [];
  for (let i=0; i<cols; i++) {
    pos.push({pos: i, dir: 'D'})
    pos.push({pos: n-cols+i, dir: 'U'})
  }

  for (let i=0; i<n; i+=cols) {
    pos.push({pos: i, dir: 'R'})
    pos.push({pos: i+cols-1, dir: 'L'})
  }
  return pos;
}

const validPos = (pos, len) => {
  return !(pos < 0 || pos >= len);
}

const sameRow = (p1, p2, cols) => {
  return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
}

const countEnergized = (traversed) => {
  return Object.values(traversed).filter(arr => arr.length > 0).length;
}

const max = (arr) => {
  return arr.reduce((acc, val) => acc > val ? acc : val, arr[0]);
}

const solve = (data) => {
  const [parsed, cols] = parse(data);
  // let test = Object.keys(energized).map(v => energized[v].length>0 ? '#' : '.')
  const starting = getStartingPositions(cols, parsed.length);
  const energs = starting.map(s => traversedTiles(parsed, cols, s));
  const counts = energs.map(travs => countEnergized(travs));

  return max(counts);
}

const printTiles = (tiles, cols) => {
  for (let i=cols; i<=tiles.length; i+=cols) {
    let row = tiles.slice(i-cols, i).join('');
    console.log(row);
  }
}

readFile('./Day16/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))