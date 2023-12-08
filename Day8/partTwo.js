// https://adventofcode.com/2023/day/8#part1

const { readFile } = require("fs/promises");

testData = 
`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`

const lineParserRe =/(?<node>\w+)\s=\s\((?<left>\w+),\s(?<right>\w+)/;

const parse = (data) => {
  const [turnsStr, nodesStr] = data.split('\n\n');
  let nodes = {};
  for (let line of nodesStr.trim().split('\n')) {
    const { node, left, right } = line.match(lineParserRe).groups;
    nodes[node] = {L: left, R: right}
  }
  return [turnsStr, nodes];
}

const gcd = (a, b) => {
  return !b ? a : gcd(b, a % b);
}

const lcm = (a, b) => {
  return (a * b) / (gcd(a, b));
}

const startingNodes = (nodes) => {
  return Object.keys(nodes).filter(n => n[2] === 'A');
}

// seems data always includes exactly one cycle with exactly one destination
// and path from start to destination is alwaus = cycle length! 
const findCircle = (start, nodes, turns) => {
  let cur = start;
  let step = 0;
  while (true) {
    for (let t of turns) {
      step++;
      cur = nodes[cur][t];
      if (cur[2] === 'Z') {
        return step;
      } 
    }
  }
}

const solve = (data) => {
  const [turns, nodes] = parse(data);
  let curs = startingNodes(nodes);
  let ends = curs.map(c => findCircle(c, nodes, turns));
  let start = ends.pop();
  return ends.reduce((acc, n) => lcm(acc, n) , start);
}

readFile('./Day8/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(result => console.log(result))