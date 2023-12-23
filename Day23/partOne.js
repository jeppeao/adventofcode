// https://adventofcode.com/2023/day/23#part1

import { readFile } from 'fs/promises'

const testData = 
`#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`

const parse = (data) => {
  const rows = data.trim()
    .split('\n')
    .map(r => r.split(''));
  const items = rows.flat();
  const nRows = rows.length;
  const nCols = rows[0].length;
  const startCol = rows[0].indexOf('.');
  const endCol = rows[rows.length -1].indexOf('.');

  return [items, startCol, endCol, nCols];
}

const validNextSteps = (pos, items, nCol) => {
  if (items[pos] === '^') return [pos - nCol];
  if (items[pos] === 'v') return [pos + nCol];
  if (items[pos] === '>') return [pos + 1];
  if (items[pos] === '<') return [pos - 1];

  let valid = [];
  if (pos - nCol >= 0 && items[pos-nCol] !== 'v') {
    valid.push(pos - nCol);
  }
  if (pos + nCol < items.length && items[pos + nCol] !== '^') {
    valid.push(pos + nCol)
  }
  if (sameRow(pos, pos-1, nCol) && items[pos-1] !== '>') {
    valid.push(pos - 1);
  }
  if (sameRow(pos, pos+1, nCol) && items[pos+1] !== '<') {
    valid.push(pos + 1);
  }

  return valid.filter(pos => items[pos] !== '#')
}

const sameRow = (p1, p2, cols) => {
  return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
}

const findConnections = (pos, items, nCol, end) => {
  let q = [{pos, len: 0}];
  let visited = new Set();
  visited.add(pos);
  let connections = {};

  while (q.length > 0) {
    let { pos, len } = q.pop();
    len++;
    let next = validNextSteps(pos, items, nCol);
    next = next.filter(n => !visited.has(n))
    if (next.length > 1) {
      for (let n of next) {
        if (!connections[n]) { 
          connections[n] = len;
        }
        else {
          if (connections[n] < len) {
            connections[n] = len;
          }
        }
      }
    }
    if (next.includes(end)) {
      if (!connections[end]) { 
        connections[end] = len;
      }
      else {
        if (connections[end] < len) {
          connections[end] = len;
        }
      }
    }
    else if (next.length === 1 && !visited.has(next[0])) {
      visited.add(next[0]);
      q.push({pos: next[0], len})
    }
  }
  return connections;
}

const findAllConnected = (items, nCol, start, end) => {
  let q = [start];
  const connections = {};
  const visited = [start];
  while (q.length > 0) {
    let cur = parseInt(q.pop());
    let conns = findConnections(cur, items, nCol, end);
    connections[cur] = conns;
    for (let c of Object.keys(conns)) {
      if (!visited.includes(c)) {
        q.push(c);
        visited.push(c);
      }
    }
  }
  return connections;
}

const findPaths = (conns, start, end) => {
  const q = [{pos: start, len: 0}];
  const paths = [];
  while (q.length > 0) {

    let { pos, len } = q.pop();
    let next = conns[pos];
    for (let n of Object.keys(next)) {
      let extLen = len + next[n];
      if (n === end) {
        paths.push(extLen);
      }
      else {
        q.push({pos: n, len: extLen})
      }
    }
  }
  return paths;
}

const solve = (data) => {
  const [items, startCol, endCol, nCols] = parse(data);
  let end = items.length - 2;
  let conns = findAllConnected(items, nCols, 1, end);
  let paths = findPaths(conns, 1, end.toString());
  return paths.reduce((acc, val) => val > acc ? val : acc, paths[0]);
}

readFile('./Day23/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))