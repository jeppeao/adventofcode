// https://adventofcode.com/2023/day/3#part1


const { readFile } = require('fs/promises');

const testData = `467..114..
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

const parseData = (data) => {
  const parsed = {
    cols: 0,
    rows: 0,
    items:[],
    numbers: []
  }
  const rows = data.split('\n');
  parsed.rows = rows.length - 1;
  parsed.cols = rows[0].length;
  parsed.items = [...rows.join("")]; 
  let curNum = ''
  let pos = 0;

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
      pos = curNum === '' ? i : pos;
      curNum = curNum === '' ? c : curNum += c;
    } else {
      addNumber()
    }
  }
  if (curNum !== '') {
    addNumber();
  }
  return parsed;
}

const isSymbolAdjacent = (number, data) => {
  pos = number.position;
  length = Math.floor(Math.log10(number.value)) + 1;
  const toCheck = [];

  let left = pos - 1;
  let right = pos + length;
  let above = pos - data.cols;
  let below = pos + data.cols;
  let upRight = above + length;
  let downRight = below + length;
  let upLeft = above - 1;
  let downLeft = below - 1;

  const validPos = (pos) => {
    return !(pos < 0 || pos >= data.items.length);
  }
 
  const sameRow = (p1, p2) => {
    return (Math.floor(p1 / data.cols) === Math.floor(p2 / data.cols));
  }

  const sameCol = (p1, p2) => {
    return (p1 % data.cols === p2 % data.cols);
  }

  if (validPos(left) && sameRow(left, pos)) {toCheck.push(left)}
  if (validPos(right) && sameRow(right, pos)) {toCheck.push(right)}
  for (let i=0; i<3; i++) {
    if (validPos(above + i)) {toCheck.push(above + i)}
    if (validPos(below + i)) {toCheck.push(below + i)}
  }
  if (validPos(upRight) && sameRow(upRight, above)) {toCheck.push(upRight)}
  if (validPos(downRight) && sameRow(downRight, below)) {toCheck.push(downRight)}
  if (validPos(upLeft) && sameRow(upLeft, above)) {toCheck.push(upLeft)}
  if (validPos(downLeft) && sameRow(downLeft, below)) {toCheck.push(downLeft)}

  for (let p of toCheck) {
    let c = data.items[p]
    if (!/\d/.test(c) && c !== ".") {
      return true;
    }
  }
  return false;
}

const sumAdjacent = (text) => {
  const data = parseData(text);
  const adjacent = data.numbers.filter((n) => isSymbolAdjacent(n, data))

  const sum = adjacent.reduce((acc, num) => {return acc + num.value}, 0)
  return sum;
}

readFile('./Day3/puzzleInput.txt', 'utf-8')
  .then(file => sumAdjacent(file))
  .then(result => console.log(result));

// console.log(sumAdjacent(testData));