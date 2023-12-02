/*
--- Part Two ---

Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen

In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?
*/

const { readFile } = require('fs/promises');
const { default: test } = require('node:test');

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



