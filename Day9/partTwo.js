// https://adventofcode.com/2023/day/9#part1

import { readFile } from 'fs/promises'

const testData = 
`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`

const parse = (data) => {
  return data.trim()
    .split('\n')
    .map(h => h.split(' ').map(Number));
}

const differences = (arr) => {
  let difs = [];
  for (let i=1; i<arr.length; i++) {
    difs.push(arr[i] - arr[i-1]);
  }
  return difs;
}

const firstValArray = (arr) => {
  let fvs = [arr[0]];
  let cur = arr;
  while (!cur.every(n => n === 0)) {
    cur = differences(cur);
    fvs.push(cur[0]);
  }
  return fvs.reverse();
}

const nextValue = (arr) => {
  return firstValArray(arr).reduce((acc, n) => n - acc, 0);
}

const solve =(data) => {
  const parsed = parse(data);
  const sum = parsed.map(h => nextValue(h)).reduce((acc,n) => acc+n, 0);
  return sum;
}


readFile('./Day9/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))