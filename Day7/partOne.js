// https://adventofcode.com/2023/day/7#part1

const { readFile } = require("fs/promises");

const testData =
`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

const cards = ['A', 'K', 'Q', 'T', 9, 8, 7, 6, 5, 4, 3, 2, 'J'];
const cardPriority = cards.reduce((acc, c, i, a) => ({...acc, [c]: i}),{})

const parse = (data) => {
  return (
     data.trim()
    .split('\n')
    .map(h => h.split(' '))
    .map(h => [h[0], parseInt(h[1])])
  );
}

const countCards = (hand) => {
  let count = {};
  for (let c of hand[0]) {
    count[c] = count[c] ? count[c] + 1 : 1;
  }
  return count;
}
const handType = (hand) => {
  let count = countCards(hand);
  let counts = Object.values(count);
  if (counts.includes(5)) {
    return 1;
  }
  if (counts.includes(4)) {
    return 2;
  }
  if (counts.includes(3) && counts.includes(2)) {
    return 3;
  }
  if (counts.includes(3)) {
    return 4;
  }
  let twos = 0;
  for (let c of counts) {
    if (c === 2) twos++;
  }
  if (twos === 2) {
    return 5;
  }
  if (twos === 1) {
    return 6;
  }
  return 7;
}


const compareHands = (h1, h2) => {
  if (h1[2] > h2[2]) return -1;
  if (h1[2] < h2[2]) return 1;
  for (let i=0; i<5; i++) {
    if (cardPriority[h1[0][i]] > cardPriority[h2[0][i]]) return -1;
    if (cardPriority[h1[0][i]] < cardPriority[h2[0][i]]) return 1;
  }
  return 0;
}

const solve = (data) => {
  const parsed = parse(data);
  const hands = parsed.map(h => [...h, handType(h).toString()])
  const sorted = hands.sort(compareHands);
  const score = sorted.reduce((acc, h, i, a) => acc + h[1] * (i+1),0) 

  return score;
}


readFile('./Day7/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(result => console.log(result))