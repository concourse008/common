'use strict';
let g =0;
const nomal = [
  'g+10',
  't+50',
  'o+1'
]

const trade = [
  'g+10 t-50',
  't+50 o-1',
  'o+1 g-10'
]

const bad = [
  'g-10',
  't-50',
  'o-1'
]

const toobad = [
  'g-10 or t-30',
  'g-'
]


const all = nomal.concat(trade).concat(bad);

function test(){
  let i = Math.floor(Math.random()*all.length);
  console.log(all[i]);
}