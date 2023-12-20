// https://adventofcode.com/2023/day/20#part1

import { readFile } from 'fs/promises'

const testData = 
`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`

const testData2 =
`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> c
%c ->
`

const parse = (data) => {
  const parsed = data.trim()
    .split('\n')
    .map(m => m.split('->').map(s => s.trim()))
    .map(m => { 
      return {
        name: m[0] === 'broadcaster' ? m[0] : m[0].slice(1), 
        type: m[0] === 'broadcaster' ? m[0] : m[0].slice(0,1),
        dest: m[1].length > 0 ? m[1].split(', ') : []
      }
    });
  return parsed;
}

const getModules = (parsed) => {
  const modules = {};
  for (let i=0; i<parsed.length; i++) {
    let id = parsed[i].name;
    let type = parsed[i].type;
    let dests = parsed[i].dest;
    modules[id] = {type, dests};
  }
  return modules;
}

const getSources = (modules) => {
  const sources = {};
  const keys = Object.keys(modules);
  for (let k of keys) {
    for (let d of modules[k].dests) {
      if (sources[d] === undefined) {
        sources[d] = [];
      }
      sources[d].push(k)
    }
  }
  return sources;
}

const getPulseHandlers = (modules, sources) => {
  const keys = Object.keys(modules);
  const handlers = {};
  for (let key of keys) {
    const dests = modules[key].dests
    if (key === 'broadcaster') {
      handlers[key] = createBroadcasterModule(dests);
    }
    if (modules[key].type === '%') {
      handlers[key] = createFlipFlopModule(key, dests);
    }
    if (modules[key].type === '&') {
      handlers[key] = createConjunctionModule(key, dests, sources[key]);
    }
  }
  return handlers
}

const createFlipFlopModule = (id, dests) => {
  let on = false;
  const destinations = dests;
  const source = id;
  return (input) => {
    if (input.pulse === 0) {
      let pulse = on ? 0 : 1;
      on = !on;
      return destinations.map(dest => {return {source, dest, pulse}})
    }
    return [];
  }
}

const createConjunctionModule = (id, dests, sources) => {
  const mem = Object.fromEntries(sources.map(i => [i, 0]));
  const destinations = dests;
  const source = id;
  return (input) => {
    mem[input.source] = input.pulse;
    const pulse = Object.values(mem).every(m => m === 1) ? 0 : 1;
    return destinations.map(dest => {return {source, dest, pulse}})
  }
}

const createBroadcasterModule = (dests) => {
  const source = 'broadcaster';
  const destinations = dests;
  return (input) => {
    return destinations.map(dest => { 
      return { source, dest, pulse: input.pulse }
    });
  }
}

const processPulse = (handlers, pulse) => {
  let s = [pulse];
  let count = {0: 0, 1:0}
  count[pulse.pulse] += 1;
  while (s.length > 0) {
    let cur = s.shift();
    let processed = handlers[cur.dest] ? handlers[cur.dest](cur) : [];
    s = s.concat(processed);
    for (let p of processed) {
      count[p.pulse] += 1;
    }
  }
  return count;
}

const dumbPush = (handlers, startPulse, n) => {
  let count = {0: 0, 1:0}
  for (let i=0; i<n; i++) {
    let c = processPulse(handlers, startPulse);
    count[0] += c[0];
    count[1] += c[1];
  }
  return count;
}

const solve = (data) => {
  const parsed = parse(data);
  const modules = getModules(parsed);
  const sources = getSources(modules);
  const handlers = getPulseHandlers(modules, sources)
  let startPulse = {dest: 'broadcaster', pulse: 0, source: null}
  let count = dumbPush(handlers, startPulse, 1000)

  return count[0] * count[1];
}

readFile('./Day20/puzzleInput.txt', 'utf-8')
  .then(file => solve(file))
  .then(res => console.log(res))