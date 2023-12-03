// https://adventofcode.com/2023/day/2#part1


const testString = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

const { readFile } = require('fs/promises');

maxValues = {red: 12, green: 13, blue: 14}

const idReg = /(\d+):/;
const drawsReg = /(\s\d+\s[a-z]+,*)+/g;
const colorsReg = /((\d+)\s(blue|red|green))+/g;

const readColors = (text) => {
  const colors = {};
  for (let col of text.matchAll(colorsReg)) {
    colors[col[3]] = parseInt(col[2])
  }
  return colors;
}

const isPossibleDraw = (draw) => {
  for (let col of Object.keys(maxValues)) {
    if (col in draw && draw[col] > maxValues[col]) {
      return false;
    }
  }
  return true;
}

const findValidGames = (text) => {
  const games = []
  for (let game of text.split("\n")) {
    const id = game.match(idReg)[1];
    const draws = game.match(drawsReg);
    let validGame = true;
    for (let d of draws) {
      colorCount = readColors(d);
      const isPossible = isPossibleDraw(colorCount);
      if (!isPossible) {
        validGame = false;
      }
    }
    if (validGame) {
      games.push(id); 
    }
  }
  return games;
}



readFile('./Day2/puzzleInput.txt', 'utf-8')
  .then(file => findValidGames(file))
  .then(gameIds => gameIds.reduce((acc, id) => { return  acc + parseInt(id) }, 0 ))
  .then(result => console.log(result));


