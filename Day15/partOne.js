// https://adventofcode.com/2023/day/15#part1

import { readFile } from 'fs/promises'

const testData = 
`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`

const parse = (data) => {
  const parsed = data.replace(/[\r\n]/gm, '').trim().split(',');
  return parsed;
}

const hash = (input) => {
  let curVal = 0;
  for (let i=0; i<input.length; i++) {
    let ASCII = input.charCodeAt(i);
    curVal += ASCII;
    curVal *= 17;
    curVal = curVal % 256;
  }
  return curVal;
}

const solve = (data) => {
  const parsed = parse(data);
  let total = 0;
  for (let str of parsed) {
    let hashed = hash(str);
    total += hashed;
  }
  return total;
}

readFile('./Day15/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))

  