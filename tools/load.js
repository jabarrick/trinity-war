// Load the game logic from index.html into a Node VM context (no browser needed).
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function load(opts){
  opts=opts||{};
  const html=fs.readFileSync(opts.file||path.join(__dirname,"..","index.html"),"utf8");
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  const code=scripts[scripts.length-1];
  const el={innerHTML:"",scrollTop:0,scrollHeight:0,classList:{add(){},remove(){}},addEventListener(){},querySelectorAll(){return[]},querySelector(){return null}};
  const store={};
  const ctx={console,setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>0,
    navigator:{language:opts.lang||"zh-CN",vibrate(){}},
    localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},
    document:{getElementById:()=>el,querySelector:()=>null,querySelectorAll:()=>[],documentElement:{lang:""},title:"",addEventListener(){},body:el},
    confirm:()=>true,matchMedia:()=>({matches:false})};
  ctx.window=ctx;
  vm.createContext(ctx);
  ctx.COVER_SRC="";vm.runInContext(code+"\n;this.__G=function(n){return eval(n)};this.__S=function(v){S=v};",ctx,{filename:"index.html"});
  ctx.seed=function(s){ctx.__rng=mulberry32(s);vm.runInContext("Math.random=function(){return __rng()}",ctx)};
  return ctx;
}
module.exports={load,mulberry32};
