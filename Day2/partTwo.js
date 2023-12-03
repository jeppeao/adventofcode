// https://adventofcode.com/2023/day/2#part2


const testString = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

const { readFile } = require('fs/promises');

const idReg = /(\d+):/;
const drawsReg = /(\s\d+\s[a-z]+,*)+/g;
const colorsReg = /((\d+)\s(blue|red|green))+/g;

const minCube = (draws) => {
  const minCubes = {blue: 0, red: 0, green: 0}
  for (let draw of draws) {
    for (let col of draw.matchAll(colorsReg)) {

      const name = col[3];
      const count = parseInt(col[2]);
      if (count > minCubes[name]) {
        minCubes[name] = count;
      }
    }
  }
  return minCubes['blue'] * minCubes['red'] * minCubes['green'];
}

const findMinCubes = (text) => {
  const cubePowers = [];
  for (let game of text.split("\n")) {
    const id = game.match(idReg)[1];
    const draws = game.match(drawsReg);
    cubePowers.push(minCube(draws));
  }
  return cubePowers;
}



readFile('./Day2/puzzleInput.txt', 'utf-8')
  .then(file => findMinCubes(file))
  .then(powers => powers.reduce((acc, p) => { return  acc + p }, 0 ))
  .then(result => console.log(result));
