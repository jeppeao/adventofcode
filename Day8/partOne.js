// https://adventofcode.com/2023/day/8#part1

const { readFile } = require("fs/promises");

testData = 
`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`

testData2 =
`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
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

const solve = (data) => {
  const [turns, nodes] = parse(data);
  let steps = 0;
  let cur = 'AAA';
  while (cur !== 'ZZZ') {
    for (let t of turns) {
      cur = nodes[cur][t]
    }
    steps += turns.length;
  }
  return steps
}


readFile('./Day8/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(result => console.log(result))