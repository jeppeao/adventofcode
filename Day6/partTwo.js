// https://adventofcode.com/2023/day/6#part2
// dist = (t - holdTime) * holdTime => 0 = th - h^2 - dist


const { readFile } = require('fs/promises');

testData =
`Time:      7  15   30
Distance:  9  40  200;`

const parse = (data) => {
  return data.split("\n")
    .map(str => str.match(/(\s\d+)/g)
      .map(n => parseInt(n))
      .reduce((acc, n) => acc + n, ''))
    .map(n => parseInt(n))
}

const quadratic = (a, b, c) => {
  const discr = b * b - 4 * a * c;
  if (discr < 0) { console.log('solution is imaginary') }
  const root1 = (-b + Math.sqrt(discr)) / (2 * a);
  const root2 = (-b - Math.sqrt(discr)) / (2 * a);
  return [root1, root2];
}

const winRange = (t, d) => {
  const [r1, r2] = quadratic(-1, t, -d)
  return [Math.ceil(r1), Math.floor(r2)];
}

const solve = (data) => {
  const ranges = [];
  let parsed = parse(data);
  const [start, end] = winRange(parsed[0], parsed[1]);
  return (end - start + 1);
}

readFile('./Day6/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res));
