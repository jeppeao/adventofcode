// https://adventofcode.com/2023/day/19#part1

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
  let parts = [];
  for (let part of partsStr.matchAll(partParserRe)) {
    let x = parseInt(part.groups.x);
    let m = parseInt(part.groups.m);
    let a = parseInt(part.groups.a);
    let s = parseInt(part.groups.s);
    parts.push({x, m ,a, s})
  }
  let flows = {};
  for (let match of workflowsStr.matchAll(flowParserRe)) {
    let id = match.groups.id;
    let steps = match.groups.steps.split(',')
      .map(stepParser);
    flows[id] = steps;
  }
  return [parts, flows];
}

const stepParser = (stepStr) => {
  if (isDestinationRe.test(stepStr)) return stepStr;
  let step = stepStr.match(stepParserRe);
  let { prop, op, val, dest } = step.groups;
  val = parseInt(val);
  return { prop, op, val, dest};
}

const processStep = (part, step) => {
  if (isDestinationRe.test(step)) return step;
  if (step.op === '>') {
    if (part[step.prop] > step.val) {
      return step.dest;
    }
  }
  if (step.op === '<') {
    if (part[step.prop] < step.val) {
      return step.dest;
    }
  }
  return false;
}

const processFlow = (part, flow) => {
  let found = false;
  for (let step of flow) {
    found = processStep(part, step);
    if (found) return found;
  }
  console.log("nothing found")
}

const processPart = (part, flows) => {
  let next = 'in';
   while (!['A', 'R'].includes(next)) {
    next = processFlow(part, flows[next]);
   }
   return next;
}
const solve = (data) => {
  const [parts, flows]= parse(data);
  const processed = parts.map(p => processPart(p, flows));
  let total = 0;
  for (let i=0; i<parts.length; i++) {
    if (processed[i] === 'A') {
      total = total + parts[i].x + parts[i].m + parts[i].s + parts[i].a
    }
  }
  return total;
}

readFile('./Day19/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))