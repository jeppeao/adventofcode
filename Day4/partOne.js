// https://adventofcode.com/2023/day/4#part1


const { readFile } = require('fs/promises');

const testData = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const parserRe = /:\s+(?<winners>(\d+\s+)*)\|(?<yours>(\s+\d+)*)/g;

const arrayFromString = (string) => {
  return string.split(/\s+/).map(w => parseInt(w)).filter(w => w);
}

const countPoints = (data) => {
  let total = 0;
  for (let res of data.matchAll(parserRe)) {
    const winners = arrayFromString(res.groups.winners);
    const yours = arrayFromString(res.groups.yours);
    const hits = yours.filter(y => winners.includes(y));
    total += Math.floor(2**(hits.length-1)); 
  }
  return total;
}

readFile('./Day4/puzzleInput.txt', 'utf-8')
  .then(file => countPoints(file))
  .then(result => console.log(result));


