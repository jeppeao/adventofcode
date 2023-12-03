// https://adventofcode.com/2023/day/1#part1


const { readFile } = require('fs/promises');

const testString = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`

const firstDigitRe = /\d/;
const lastDigitRe = /(\d)(?!.*\d)/;

const findNumber = (str) => {
  return parseInt(str.match(firstDigitRe) + str.match(lastDigitRe));
}

const sumCalibrationValues = (text) => {
  return text.split("\n").reduce((acc, line) =>  acc + findNumber(line), 0)
}

readFile('./puzzleInput.txt', 'utf-8')
  .then(file => sumCalibrationValues(file))
  .then(sum => console.log(sum))


