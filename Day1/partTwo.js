// https://adventofcode.com/2023/day/1#part2


const { readFile } = require('fs/promises');

const testString = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`


const num = '1|2|3|4|5|6|7|8|9|one|two|three|four|five|six|seven|eight|nine';
const numRe = new RegExp("(?=("+num+"))", "g")
const converter = {
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
}

const findNumber = (str) => {
  matches = [...str.matchAll(numRe)];
  const comb = parseInt(converter[matches[0][1]] + converter[matches[matches.length -1][1]])
  return comb;
}

const sumCalibrationValues = (text) => {
  return text.split("\n")
    .reduce((acc, line) =>  acc + findNumber(line), 0)
}


readFile('./puzzleInput.txt', 'utf-8')
  .then(file => sumCalibrationValues(file))
  .then(sum => console.log(sum))



