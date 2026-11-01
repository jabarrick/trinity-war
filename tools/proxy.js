// Human-player stand-in for story-mode simulations. The story seat (seat 0, p.hu=1) uses the normal AI
// for everything except targeting, where it plays like a typical person: finish off anyone it can kill,
// otherwise focus fire on the opponent that will fall soonest, leaning toward whoever counters it.
"use strict";
function install(G){
  const g=G.__G,F=g("F"),estDmg=g("estDmg"),orig=g("aiTarget");
  G.aiTarget=function(ps,ai,card){
    if(!ai.hu)return orig(ps,ai,card);
    const ts=ps.filter(p=>p.alive&&p.id!==ai.id);if(!ts.length)return null;
    let best=null,bs=-1e9;
    ts.forEach(q=>{const d=card?Math.max(0.5,estDmg(ai,q,card)):3;let s=-q.hp/d;
      if(card&&d>=q.hp)s+=100;if(F[q.f].beats===ai.f)s+=1.5;if(F[ai.f].beats===q.f)s+=0.5;if(s>bs){bs=s;best=q}});
    return best};
  // vm: top-level function declarations live on the global object, so aiTurn picks up the override
  require("vm").runInContext("aiTarget=this.aiTarget",G);
}
module.exports={install};
