// https://adventofcode.com/2023/day/18#part1

import { readFile } from 'fs/promises'

const testData = 
`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`

const parse = (data) => {
  const parsed = data.trim()
    .split('\n')
    .map(r => r.split(" "))
    .map(r => {
      return { 
        dir: r[0], 
        len: parseInt(r[1]), 
        col: r[2].replace(/[\(\)]/g, '')
      }
    });
  return parsed;
}


const shoelaceArea = (coords) => {
  const last = coords.length - 1;
  let total = coords[last].x * coords[0].y - (coords[0].x * coords[last].y);
  for (let i=0; i<last; i++) {
    total += coords[i].x * coords[i+1].y - (coords[i+1].x * coords[i].y);
  }
  return total / 2;
}

const digPlanToCoords = (digPlan) => {
  let coords = [];
  let x = 0;
  let y = 0;
  for (let dig of digPlan) {
    let len = dig.len;
    switch (dig.dir) {
      case 'L': 
        x = x - len;
        break;
      case 'R':
        x += len;
        break;
      case 'U': 
        y -= len;
        break;
      case 'D':
        y += len;
        break;
    }
    coords.push({x, y})
  }
  return coords;
}

const picksTheoremInteriorPoints = (boundaryPoints , area) => {
  return area + 1 - (boundaryPoints / 2);
}

const countBoundaryPoints = (digPlan) => {
  return digPlan.reduce((acc, plan) => acc+plan.len, 0);
}

const solve = (data) => {
  const digPlan = parse(data);
  const coords = digPlanToCoords(digPlan);
  const area = shoelaceArea(coords);
  const boundaryPoints = countBoundaryPoints(digPlan);
  const interiorPoints = picksTheoremInteriorPoints(boundaryPoints, area);
  
  return interiorPoints + boundaryPoints;
}

const printTiles = (tiles, cols) => {
  const maxDigits = tiles.length.toString().length;
  for (let i=cols; i<=tiles.length; i+=cols) {
    let row = tiles.slice(i-cols, i).join('');
    console.log((i-cols).toString().padStart(maxDigits, '0'), row, countInsideRow(row));
  }
}


readFile('./Day18/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))