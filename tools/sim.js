// AI-vs-AI balance simulator.
//   node tools/sim.js quick [N]       - quick match, random seats, all-AI
//   node tools/sim.js story [N]       - each campaign chapter, AI plays the "human" seat 0 for each side
"use strict";
const {load}=require("./load");
const G=load();
G.seed(+(process.env.SEED||12345));
if(process.env.TUNE)require("vm").runInContext(process.env.TUNE,G);
const g=G.__G;
const F=g("F"),mkPlayers=g("mkPlayers"),aiTurn=g("aiTurn"),blankS=g("blankS"),CH=g("CH"),shuf=g("shuf");
const MAXR=200;
// play one game; returns winner seat or -1 (draw / timeout). If huSeat>=0 the game stops as soon as that seat dies.
function play(order,huSeat,cfg){
  const S=blankS("play");G.__S(S);
  S.ps=mkPlayers(order,huSeat,cfg);S.mod=(cfg&&cfg.mod)||{};
  let tn=0,rd=1;
  for(let step=0;step<MAXR*3;step++){
    const p=S.ps[tn];
    if(p.alive)aiTurn(S.ps,tn);
    const al=S.ps.filter(x=>x.alive);
    if(huSeat>=0&&!S.ps[huSeat].alive)return{w:al.length===1?al[0].id:-2,rd};
    if(al.length<=1)return{w:al.length?al[0].id:-1,rd};
    tn=(tn+1)%3;if(tn===0)rd++;
  }
  return{w:-1,rd,timeout:1};
}
function pct(a,b){return (100*a/b).toFixed(1)+"%"}
function quick(N){
  const fw={buddhism:0,communism:0,christianity:0},sw=[0,0,0],sp=[0,0,0];let dr=0,to=0,rds=0;
  // matchup: for each faction count wins when it sits in seat k
  const fs=Object.keys(F);
  for(let i=0;i<N;i++){
    const order=shuf(fs);const r=play(order,-1,null);rds+=r.rd;
    if(r.timeout)to++;
    if(r.w>=0){fw[order[r.w]]++;sw[r.w]++}else dr++;
  }
  const out={N,faction:{},seat:sw.map(x=>+(100*x/N).toFixed(2)),draw:+(100*dr/N).toFixed(2),timeout:to,avgRounds:+(rds/N).toFixed(1)};
  fs.forEach(f=>out.faction[f]=+(100*fw[f]/N).toFixed(2));
  // normalised among decisive games
  const dec=N-dr;out.factionDecisive={};fs.forEach(f=>out.factionDecisive[f]=+(100*fw[f]/dec).toFixed(2));
  out.seatDecisive=sw.map(x=>+(100*x/dec).toFixed(2));
  return out;
}
function story(N){
  const fs=Object.keys(F),res=[];
  CH.forEach(ch=>{
    const per={};let tw=0,tn=0;
    fs.forEach(f=>{const oth=fs.filter(x=>x!==f);let w=0;
      for(let i=0;i<N;i++){const r=play([f,oth[0],oth[1]],0,ch);if(r.w===0)w++}
      per[f]=+(100*w/N).toFixed(1);tw+=w;tn+=N});
    res.push({ch:ch.n,all:+(100*tw/tn).toFixed(1),per});
  });
  return res;
}
const mode=process.argv[2]||"quick",N=+(process.argv[3]||(mode==="quick"?30000:3000));
const t0=Date.now();
const out=mode==="story"?story(N):quick(N);
console.log(JSON.stringify(out,null,1));
console.error("time "+((Date.now()-t0)/1000).toFixed(1)+"s");
