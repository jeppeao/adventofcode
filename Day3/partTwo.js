// https://adventofcode.com/2023/day/3#part2

const { readFile } = require('fs/promises');

const testData = 
`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`

const adjacentPositions = (pos, cols, length) => {
  const adjacent = [];

  const validPos = (pos) => {
    return !(pos < 0 || pos >= length);
  }
 
  const sameRow = (p1, p2) => {
    return (Math.floor(p1 / cols) === Math.floor(p2 / cols));
  }

  let left = pos - 1;
  let right = pos + 1;
  let above = pos - cols;
  let below = pos + cols;
  let upRight = above + 1;
  let downRight = below + 1;
  let upLeft = above - 1;
  let downLeft = below - 1;

  if (validPos(left) && sameRow(left, pos)) {adjacent.push(left)}
  if (validPos(right) && sameRow(right, pos)) {adjacent.push(right)}
  if (validPos(above)) {adjacent.push(above)}
  if (validPos(below )) {adjacent.push(below)}
  if (validPos(upRight) && sameRow(upRight, above)) {adjacent.push(upRight)}
  if (validPos(downRight) && sameRow(downRight, below)) {adjacent.push(downRight)}
  if (validPos(upLeft) && sameRow(upLeft, above)) {adjacent.push(upLeft)}
  if (validPos(downLeft) && sameRow(downLeft, below)) {adjacent.push(downLeft)}
 
  return adjacent;
}

const parseData = (data) => {
  const parsed = {
    cols: 0,
    rows: 0,
    items:[],
    numbers: [],
    gears: []
  }
  const rows = data.split('\n');
  parsed.rows = rows.length - 1;
  parsed.cols = rows[0].length;
  parsed.items = [...rows.join("")]; 
  let curNum = ''
  let pos = [];

  const addNumber = () => {
    if (curNum !== '') {
      parsed.numbers.push({value: parseInt(curNum), position: pos});
      curNum = '';
    }
  }

  for (let [i, c] of parsed.items.entries()) {
    if (i % parsed.cols === 0) {
      if (curNum !== '') {
        addNumber()
      }
      curNum = '';
    }
    if (/\d/.test(c)) {
      pos = curNum === '' ? [i] : pos.concat(i);
      curNum = curNum === '' ? c : curNum += c;
    } else {
      addNumber()
    }
    if (/\*/.test(c)) {
      parsed.gears.push(i);
    }
  }
  if (curNum !== '') {
    addNumber();
  }
  return parsed;
}

const numberAtPosition = (pos, data) => {
  const validPos = (pos) => {
    return !(pos < 0 || pos >= data.items.length);
  }
 
  const sameRow = (p1, p2) => {
    return (Math.floor(p1 / data.cols) === Math.floor(p2 / data.cols));
  }

  if (!/\d/.test(data.items[pos])) { return false }
  let cur = pos;
  while (validPos(cur-1) && sameRow(cur-1, pos) && /\d/.test(data.items[cur-1])) {
    cur -= 1;
  }
  let positions = [cur];
  let number = data.items[cur];
  while (validPos(cur+1) && sameRow(cur+1, pos) && /\d/.test(data.items[cur+1])) {
    cur += 1;
    number += data.items[cur];
    positions = positions.concat(cur)
  }
  return {value: parseInt(number), positions}
}

const adjacentNumbers = (pos, data) => {
  neighbors = adjacentPositions(pos, data.cols, data.items.length)
  adjNumbers = neighbors.map(n => numberAtPosition(n, data));
  adjNumbers = adjNumbers.filter(n => n);
  const uniqueList = [];
  for (let n of adjNumbers) {
    unique = true;
    for (let u of uniqueList) {
      if (u.positions[0] === n.positions[0]) {
        unique = false;
      }
    }
    if (unique) {
      uniqueList.push(n)
    }
  }
  
  return uniqueList.map(n=> n.value);
}

const doubleGears = (data) => {
  const dg = [];
  for (let gear of data.gears) {
    const adj = adjacentNumbers(gear, data);
    if (adj.length === 2) {
      dg.push(adj)
    }
  }
  return dg;
}

const gearRatioSum = (data) => {
  const dg = doubleGears(data);
  let sum = 0;
  for (let v of dg) {
    sum += v[0] * v[1]
  }
  return sum
}


readFile('./Day3/puzzleInput.txt', 'utf-8')
  .then(file => parseData(file))
  .then(data => gearRatioSum(data))
  .then(result => console.log(result))

// const data = parseData(testData);
// console.log(gearRatioSum(data))

