// https://adventofcode.com/2023/day/4#part2


const { readFile } = require('fs/promises');

const testData = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const parserRe = /Card\s+(?<card>\d+):\s+(?<winners>(\d+\s+)*)\|(?<yours>(\s+\d+)*)/g;

const arrayFromString = (string) => {
  return string.split(/\s+/).map(w => parseInt(w)).filter(w => w);
}

const countCards = (data) => {
  let n = data.trim().split("\n").length;
  let nCards = {};
  for (let cid=1; cid<=n; cid++) {
    nCards[cid] = 1;
  }

  for (let res of data.matchAll(parserRe)) {
    const winners = arrayFromString(res.groups.winners);
    const yours = arrayFromString(res.groups.yours);
    const hits = yours.filter(y => winners.includes(y));
    const cid = res.groups.card;
    for (let i=1; i<=hits.length; i++) {
      let cur = parseInt(cid) + i;
      if (cur <= n) {
        nCards[cur] += nCards[cid];
      }
    }
  }
  
  const sum = Object.values(nCards).reduce((acc, n) => acc + n, 0);
  return sum;
}

readFile('./Day4/puzzleInput.txt', 'utf-8')
  .then(file => countCards(file))
  .then(result => console.log(result));


// console.log(countCards(testData))