// https://adventofcode.com/2023/day/19#part2

import { readFile } from 'fs/promises'

const testData = 
`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

const partParserRe = /\{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)/g;
const flowParserRe = /(?<id>[a-z]+)\{(?<steps>[^}]+)\}/g;
const stepParserRe = /(?<prop>[x|a|m|s])(?<op>[<|>])(?<val>\d+):(?<dest>\w+)/;
const isDestinationRe = /^[a-zA-Z]+$/;

const parse = (data) => {
  const [workflowsStr, partsStr] = data.split('\n\n');
  let flows = {};
  for (let match of workflowsStr.matchAll(flowParserRe)) {
    let id = match.groups.id;
    let steps = match.groups.steps.split(',')
      .map(stepParser);
    flows[id] = steps;
  }
  return flows;
}

const stepParser = (stepStr) => {
  if (isDestinationRe.test(stepStr)) return stepStr;
  let step = stepStr.match(stepParserRe);
  let { prop, op, val, dest } = step.groups;
  val = parseInt(val);
  return { prop, op, val, dest};
}

const processStep = (step, range) => {
  if (isDestinationRe.test(step)) {
    if (step === 'A') return [JSON.parse(JSON.stringify({...range, dest: 'A'}))];
    if (step === 'R') return [JSON.parse(JSON.stringify({...range, dest: 'R'}))];
    return [JSON.parse(JSON.stringify({...range, dest: step}))];
  }
  let passRange = JSON.parse(JSON.stringify({...range, dest: step.dest}));
  let failRange = JSON.parse(JSON.stringify({...range, dest: false}));
  let min = range[step.prop].min;
  let max = range[step.prop].max;
  if (step.op === '>') {
    passRange[step.prop].min = min <= step.val ? step.val + 1 : min;
    failRange[step.prop].max = max > step.val ?  step.val : max;
    return [passRange, failRange];
  }
  if (step.op === '<') {
    passRange[step.prop].max = max >= step.val ? step.val - 1 : max;
    failRange[step.prop].min = min > step.val ? min : step.val;
    return [passRange, failRange];
  }
  console.log('something went wrong')
  return false;
}

const processFlow = (range, flow) => {
  const resultRanges = [];
  let survivors = range;
  for (let step of flow) {
    let [pass, fail] = processStep(step, survivors);
    if (!fail) {
      if (pass.dest === 'A') resultRanges.push(pass);
      else if (pass.dest !== 'R') resultRanges.push(pass)
    }
    else {
      survivors = fail;
      resultRanges.push(pass);
    }
  }
  return resultRanges;
}

const processRange = (range, flows) => {
  const accepted = [];
  let q = [range];
  let cur;
  while (q.length > 0) {
    cur = q.pop();
    if (cur.dest === 'A') accepted.push(cur);
    else if (cur.dest !== 'R') {
      let next = processFlow(cur, flows[cur.dest]);
      q = q.concat(next);
    }
  }
  return accepted
}

const countWays = (result) => {
  let numbers = Object.values(result);
  return numbers
    .slice(0, numbers.length - 1)
    .map(r => r.max - r.min + 1)
    .reduce((acc, val) => acc * val, 1);
}

const min = (n1, n2) => {
  return n1 > n2 ? n2 : n1;
}
const max = (n1, n2) => {
  return n1 < n2 ? n2 : n1;
}

const solve = (data) => {
  const flows = parse(data);
  const ranges = {
    x: {min: 1, max: 4000},
    m: {min: 1, max: 4000},
    a: {min: 1, max: 4000},
    s: {min: 1, max: 4000},
    dest: 'in'
  }
  let accepted = processRange(ranges, flows);
  let ways = accepted.map(countWays).reduce((acc, val) => acc + val, 0);
 
  return ways;
}

readFile('./Day19/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))