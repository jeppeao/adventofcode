// https://adventofcode.com/2023/day/6#part1
// dist = (t - holdTime) * holdTime


const { readFile } = require('fs/promises');

testData =
`Time:      7  15   30
Distance:  9  40  200;`

const parse = (data) => {
  return data.split("\n")
    .map(str => str.match(/(\s\d+)/g)
      .map(n => parseInt(n))
    );
}

const winRange = (t, d) => {
  let ht = 0;
  let dist = 0;

  while (dist <= d) {
    ht++;
    dist = (t - ht) * ht;
  }
  let start = ht;
  let end;
  while (dist > d) {
    end = ht;
    ht++;
    dist = (t - ht) * ht;
  }

  return [start, end];
}

const solve = (data) => {
  const ranges = [];
  let parsed = parse(data);
  for (let i=0; i < parsed[0].length; i++) {
    const [start, end] = winRange(parsed[0][i], parsed[1][i]);
    ranges.push(end - start + 1);
  }
  return (ranges.reduce((acc, val) => val * acc, 1));
}

readFile('./Day6/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res));
