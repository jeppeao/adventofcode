// https://adventofcode.com/2023/day/21#part2
// solution copied from https://topaz.github.io/paste/#XQAAAQC3BQAAAAAAAAAzHUn/qWH7EwabIo363rcY5+qgXmPV7N++kDKUNVqpdxLx5ALztLD8JbsxWQoqaYoWk1LQqJD1GWoSR8s9L3mNyO4gQ+t7GGicv79QkOenjs8SXabqxDbJZfEK73BVbwVYC+U/bGiOMz/6gPG42VOzBCfXIq5KbNLvswJPg7mSDG8Iv1U32F8CByXfymd2qYs6yOa0gbwcCJp/3d7nHb59Hu2vBBKqX1b7klR+9QAc2k9lmDSt6qtT5qHQm3Aa9IysWwjGgB9m22b2UlfKuKFkjajLecDrcKLGtKexhN4TMbfzc0ISGfhprT9WazI6U+0gj2MLVdtbytewnt+vAZ3eJB9lbJrBCq6pWVawGnCPi7phPObHuhAYw9P7x1IPUYQ7+c/R6fH59v7MCIVTee/vqAjUvq2wDt9YSrQE1bWcbTOfQdbf8dB3Vw5v33VBdiuCF8QkugnnKAnpgr84ZfKuVsv2Z5IujhD4FIDuy7qKagMqwKg1oWmeeK7eRUTQXm4AGIWatAN9GAO8s9xyZXkoJkDxL2FjMUNnubETNoOmrXo1h3vpsDzafk2obzqZ8/NWlAcWFiYgbTRN8y7KfGPr/D5ilGDVzQtOH+FDBeWtoJJUuGm0oxK2BhMOEvlc4EYh8MLWFGfmyrPHc1ZTRGD3cWjjgdfiYxC/IF+13M0vPNFF5g0kddUzGuSy0YzIlJka8t5wz3OXN4tkjI5zVs165kXJv9kQBx29By8MlR0ad+LO1Ngc+3dQLJ3kXxl+PMXzSMbplD3HF+Z5wmAqA4KKL5QUNdIDUsFIfog+3+jmhIi2ZpAfD2/HvDfDvW+W+0AMJffu4M+WuoQmoOr2IpaZrxPa8C9Fn/2K+BI=
// let f(n) be reachable spaces in n steps
// let X be width of (square) input grid
// f(n), f(n+X), f(n+2X), ...., is a quadratic, 
// it can be determined by finding the first 3 values
// then use that to interpolate the final answer. 
// interpolation : https://www.wolframalpha.com/input?i=quadratic+fit+calculator&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3x%22%7D+-%3E%22%7B0%2C+1%2C+2%7D%22&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3y%22%7D+-%3E%22%7B3943%2C+35126%2C+97407%7D%22
// steps = 26501365 = 202300 * 131 + 65, and 131 is the grid width
// how can you identify the quadratic relation from the data???


import { readFile } from 'fs/promises'

const testData = 
`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`


function d21(data) {
  let inp = data.trim().split("\n");
  //let inp = "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........".split("\n");
  let deser = str=>str.split(",").map(x=>+x);
  let mod = (a,b)=>(a%b+b)%b;
  
  console.log(inp.length,inp[0].length);
  
  let locs = {};
  let gd = (y,x)=>{
    //if (y<0 || y>=inp.length || x<0 || x>=inp[y].length) return "#";
    return inp[mod(y,inp.length)][mod(x,inp.length)];
  }
  
  let ret = 0;
  for (let y=0;y<inp.length;y++) {
    for (let x=0;x<inp[y].length;x++) {
      if (inp[y][x] == "S") locs[y+","+x] = true;
    }
  }
  for (let i=1;i<=131*3+65;i++) {
    let nlocs = {};
    for (let l in locs) {
      let [y,x] = deser(l);
      if (gd(y-1,x) != "#") nlocs[(y-1)+","+x] = true;
      if (gd(y+1,x) != "#") nlocs[(y+1)+","+x] = true;
      if (gd(y,x-1) != "#") nlocs[(y)+","+(x-1)] = true;
      if (gd(y,x+1) != "#") nlocs[(y)+","+(x+1)] = true;
    }
    if (i==64) {
      let cnt = 0;
      for (let l in nlocs) cnt++;
      console.log("part 1", cnt);
    }
    if (i%131==65) {
      let cnt = 0;
      for (let l in nlocs) cnt++;
      console.log(cnt);
    }
    locs = nlocs;
  }
}

/* output
131 131
part 1 3858
3943
35126
97407
190786

196, 327, 458
wolfram output: 3943 + 15634 x + 15549 x^2

*/
// readFile('./Day21/puzzleInput.txt', 'utf-8')
//   .then(file => d21(file))
//   .then(res => console.log(res))

let s = 202300;
const fn = (x) => {
  return 3943 + 15634 * x + 15549 * x**2;
}
console.log(fn(s))