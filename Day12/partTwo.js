// https://adventofcode.com/2023/day/12#part1

import { readFile } from 'fs/promises'

const testData = 
`???.### 1,1,3
..??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`

const parse = (data) => {
  const lines = data.trim().split('\n')
    .map(entry => entry.split(' '))
    .map(rec => [
      (rec[0] + '?').repeat(4) + rec[0], 
      repeatArray(rec[1].split(',').map(Number), 5)
    ])
  return lines;
}

const repeatArray = (arr, n) => Array(n).fill(arr).flat();

const memoizer = (func) => {
  let cache = {};
  return (...args) => {
    let lookup = JSON.stringify(args);
    if (lookup in cache) {
      return cache[lookup];
    }
    let result = func(...args);
    cache[lookup] = result;
    return result;
  }
}


const countPossibilities = memoizer((line, runs) => {
  if (line.length === 0) {
    if (runs.length === 0) {
      return 1;
    }
    return 0;
  }
  if (runs.length === 0) {
    for (let i=0; i<line.length; i++) {
      if (line[i] === '#') {
        return 0;
      }
    }
    return 1;
  }

  const requiredForRuns = runs.reduce((acc, v) => acc+v, 0) + runs.length -1;
  if (line.length < requiredForRuns) {
    return 0;
  }

  if (line[0] === '.') {
    return (countPossibilities(line.slice(1), runs))
  }

  if (line[0] === '#') {
    let runLength = runs[0];
    for (let i=0; i<runLength; i++) {
      if (line[i] === '.') {
        return 0;
      }
    }
    if (line[runLength] === '#') {
      return 0;
    }

    return countPossibilities(line.slice(runLength+1), runs.slice(1));
  }

  return (
    countPossibilities('#' + line.slice(1), runs) 
    + countPossibilities('.' + line.slice(1), runs)
  );
})

const solve = (data) => {
  const parsed = parse(data);
  let total = 0;
  for (let line of parsed) {
    let res = countPossibilities(line[0], line[1]);
    total += res;
  }
  
  return total;
}



readFile('./Day12/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))