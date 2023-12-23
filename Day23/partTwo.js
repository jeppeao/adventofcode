// https://adventofcode.com/2023/day/23#part2

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
  let valid = [];
  pos = parseInt(pos);
  if (pos - nCol >= 0) {
    valid.push(pos - nCol);
  }
  if (pos + nCol < items.length) {
    valid.push(pos + nCol)
  }
  if (sameRow(pos, pos-1, nCol)) {
    valid.push(pos - 1);
  }
  if (sameRow(pos, pos+1, nCol)) {
    valid.push(pos + 1);
  }

  return valid.filter(pos => items[pos] !== '#').map(Number)
}

const sameRow = (p1, p2, cols) => {
  return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
}

const findConnections = (pos, items, nCol, end) => {
  let connections = {};
  let pathStarts = validNextSteps(pos, items, nCol);
  for (let p of pathStarts) {
    let visited = [pos, p];
    let len = 1;
    let next = [p]
    while (next.length === 1) {
      let cur = next.pop();
      if (cur === end) {
        connections[cur] = len;
        break;
      }
      let following = validNextSteps(cur, items, nCol);
      following = following.filter(v => !visited.includes(v));
      visited = visited.concat(following);
      if (following.length > 1) {
        connections[cur] = len;
        break;
      }
      next = next.concat(following);
      len++
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
  const q = [[start]];
  const paths = [];
  while (q.length > 0) {
    let cur = q.pop();
    let last = cur[cur.length-1];
    let next = conns[last];
    if (last === end) {
      paths.push(cur);
    }
    else {
      for (let n of Object.keys(next)) {
        let val = parseInt(n);
        if (!cur.includes(val)) {
          q.push([...cur, val])
        }
      }
    }
  }
  return paths;
}

const pathToLength = (path, conn) => {
  let len = 0;
  for (let i=1; i<path.length; i++) {
    len += conn[path[i-1]][path[i]]
  }
  return len;
}

const solve = (data) => {
  const [items, startCol, endCol, nCols] = parse(data);
  let end = items.length - 2;
  let conns = findAllConnected(items, nCols, 1, end);
  let paths = findPaths(conns, 1, end);
  paths = paths.map(p => pathToLength(p, conns))

  return paths.reduce((acc, val) => val > acc ? val : acc, paths[0]);
}

readFile('./Day23/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))