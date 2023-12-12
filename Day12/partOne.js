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
    .map(rec => [rec[0], rec[1].split(',').map(Number)])
  return lines;
}

const nChooseK = (curArr, choiceArr, k, callBc) => {
  if (k === 0) {
    callBc(curArr);
    return;
  }

  for (let i=0; i<choiceArr.length; i++) {
    let nextCur = curArr.concat(choiceArr[i]);
    let nextChoices = [...choiceArr.slice(i+1)];
    nChooseK(nextCur, nextChoices, k-1, callBc)
  }
}


const countContiguous = (str) => {
  let curCount = 0;
  let contig = [];
  for (let i=0; i<str.length; i++) {
    if (str[i] === '#') curCount++;
    if (str[i] === '.' && curCount >0) {
      contig.push(curCount);
      curCount = 0;
    }
  }
  if (curCount > 0) contig.push(curCount);
  return contig;
}

const contigMatch = (c1, c2) => {
  if (c1.length !== c2.length) return false;
  for (let i=0; i<c1.length; i++) {
    if (c1[i] !== c2[i]) return false;
  }
  return true;
}

const blankIndexes = (str) => {
  let blanks = [];
  for (let i=0; i<str.length; i++) {
    if (str[i] === '?') blanks.push(i);
  }
  return blanks;
}

const count = (char, str) => {
  let count = 0;
  for (let i=0; i<str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
}

const sum = (arr) => {
  return arr.reduce((acc, val) => acc + val, 0);
}

const fillString = (str, faultyArr) => {
  let filled = '';
  for (let i=0; i<str.length; i++) {
    if (str[i] === '?') {
      filled += faultyArr.includes(i) ? '#' : '.';
    }
    else {
      filled += str[i];
    }
  }

  return filled;
}

const validater = (contigArr, str, counter) => {
  return (faultyArr) => {
    let match = contigMatch(contigArr, countContiguous(fillString(str, faultyArr)));
    if (match) counter.valid++;    
  }
}
const solve = (data) => {
  const parsed = parse(data);
  let totalValid = 0;
  for (let line of parsed) {
    let counter = {valid: 0}
    let blankArr = blankIndexes(line[0]);
    let totalFaulty = sum(line[1])
    let knownFaulty = count('#', line[0]);
    let k = totalFaulty - knownFaulty;
    nChooseK([], blankArr, k, validater(line[1], line[0], counter));
    totalValid += counter.valid;
  }

  return totalValid;
}

readFile('./Day12/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))