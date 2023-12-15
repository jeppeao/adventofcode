// https://adventofcode.com/2023/day/15#part2

import { readFile } from 'fs/promises'

const testData = 
`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`;

const stepParse = /(?<label>[a-zA-Z]+)(?<op>[=-])(?<lens>\d*)/

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

const indexOfLabel = (arr, label) => {
  for (let i=0; i<arr.length; i++) {
    if (arr[i][0] === label) {
      return i;
    }
  }
  return false;
}

const arrangeLenses = (instructions) => {
  let keys = [...Array(256).keys()];
  let boxes = keys.map(k => [k, []]);
  for (let instr of instructions) {
    const parsed = instr.match(stepParse);
    const {label, op, lens} = parsed.groups;
    const box = hash(label);
    const lenses = boxes[box][1];
    const index = indexOfLabel(lenses, label);
    if (op === '-') {
      if (index !== false) {
        boxes[box][1] = [...lenses.slice(0, index), ...lenses.slice(index+1)]
      }
    }
    if (op === '=') {
      if (index === false) {
         boxes[box][1].push([label, lens])
      }
      else {
        boxes[box][1][index] = [label, lens]
      }
    }
  }
  return boxes;
}

const calcFocusingPower = (boxes) => {
  let total = 0;
  for (let i=0; i<256; i++) {
    for (let [j, lens] of boxes[i][1].entries()) {
      total += (i+1) * (j+1) * lens[1];
    }
  }
  return total;
}

const solve = (data) => {
  const parsed = parse(data);
  const arranged = arrangeLenses(parsed);
  let total = calcFocusingPower(arranged);
  
  return total;
}

readFile('./Day15/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))