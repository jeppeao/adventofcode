// https://adventofcode.com/2023/day/24#part1

import { readFile } from 'fs/promises'

const testData = 
`19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`

const parse = (data) => {
  const parsed = data.trim()
    .split('\n')
    .map(line => line.split('@')
      .map(coords => coords.split(',').map(Number))
    );
  return parsed;
}

// formula from wikipedia, has bug somehow, does not find all intersections
// used different formula below instead
const intersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  let xq = (x1 * y2 -y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4); 
  let yq = (x1 * y2 -y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  let x = xq / d;
  let y = yq / d;
  return [x, y];
}

const isInTheFuture = (px, py, ix, iy, dx, dy) => {
  return (Math.sign(ix-px) === Math.sign(dx) && Math.sign(iy-py) === Math.sign(dy))
}

const isWithinConstraints = (x, y) => {
  const min = 200000000000000;
  const max = 400000000000000;
  // const min = 7;
  // const max = 27;
  return (x >= min && x<= max && y >= min && y <= max);
}


const doIntersect = (line1, line2) => {
  let x1 = line1[0][0];
  let y1 = line1[0][1];
  let dx1 = line1[1][0];
  let dy1 = line1[1][1];
  let x2 = line2[0][0];
  let y2 = line2[0][1];
  let dx2 = line2[1][0];
  let dy2 = line2[1][1];
  let inter = intersect(x1, y1, x1+dx1, y1+dy1, x2, y2, x2+dx2, y2+dy2);
  if (!inter) return false;
  let ix = inter['x'];
  let iy = inter['y'];
  let valid = isWithinConstraints(ix, iy);
  let future = (
    isInTheFuture(x1, y1, ix, iy, dx1, dy1) 
    && isInTheFuture(x2, y2, ix, iy, dx2, dy2)
  );
  return (valid && future) ? [ix, iy] : false;
}

const solve = (data) => {
  const parsed = parse(data);
  let crossCount = 0;
  for (let i=0; i<parsed.length; i++) {
    for (let j=i+1; j<parsed.length; j++) {
      if (doIntersect(parsed[i], parsed[j])) {
        crossCount++;
      }
    }
  }
  return crossCount;
}

readFile('./Day24/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))


// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	// if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
	// 	return false
	// }

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)
	return {x, y}
}