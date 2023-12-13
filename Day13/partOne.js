// https://adventofcode.com/2023/day/12#part1

import { readFile } from 'fs/promises'

const testData = 
`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`

const parse = (data) => {
  const patterns = data.trim()
    .split('\n\n')
    .map(p => p.split('\n').map(p => p.split('')));
  return patterns;
}

const getRowsAndColumns = (pattern) => {
  const cols = pattern[0].map(
    (_, i) => pattern.map(line => line[i])
  );
  return [pattern, cols];
}

const areSame = (v1, v2) => {
  if (v1.length !== v2.length) return false;
  for (let i=0; i<v1.length; i++) {
    if (v1[i] !== v2[i]) return false
  }
  return true;
}

const findReflection = (lines) => {
  for (let i=1; i<lines.length; i++) {
    let left = i-1;
    let right = i;
    let matches = true;
    while(left >= 0 && right < lines.length) {
      if (!areSame(lines[left], lines[right])) {
        matches = false;
      }
      left--;
      right++;
    }
    if (matches) {
      return i;
    }
  }
  return false
}

const scorePattern = (pattern) => {
  const [rows, cols] = getRowsAndColumns(pattern);
  let mirrorHorizontal = findReflection(rows);
  let mirrorVertical = findReflection(cols);

  if (mirrorVertical) {
    return mirrorVertical;
  }

  return mirrorHorizontal * 100;
}

const solve = (data) => {
  const parsed = parse(data);
  const scores = parsed.map(scorePattern)
  
  return scores.reduce((acc, val) => acc+val, 0);
}

readFile('./Day13/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))