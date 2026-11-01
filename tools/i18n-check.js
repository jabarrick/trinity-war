// Static i18n check: every zh key exists in en/pt, every card has en/pt text, no CJK in en/pt strings.
"use strict";
const {load}=require("./load");
const G=load();const g=G.__G;
const I18N=g("I18N"),CARD_I18N=g("CARD_I18N"),D=g("D");
const CJK=/[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/;
let errs=[];
function walk(ref,obj,lang,p){
  Object.keys(ref).forEach(k=>{const pk=p?p+"."+k:k;const v=obj?obj[k]:undefined;
    if(v===undefined){errs.push(lang+": missing key "+pk);return}
    if(typeof ref[k]==="object"&&ref[k]!==null){walk(ref[k],v,lang,pk);return}
    if(typeof v!=="string")return;
    if(CJK.test(v))errs.push(lang+": CJK text in "+pk+" -> "+v.slice(0,60));
    const ph=s=>(String(s).match(/\{\w+\}/g)||[]).sort().join(",");
    if(ph(ref[k])!==ph(v))errs.push(lang+": placeholder mismatch in "+pk+" zh["+ph(ref[k])+"] "+lang+"["+ph(v)+"]");
  });
  if(obj)Object.keys(obj).forEach(k=>{if(!(k in ref))errs.push(lang+": extra key "+(p?p+".":"")+k)});
}
["en","pt"].forEach(l=>{
  walk(I18N.zh,I18N[l],l,"");
  Object.keys(D).forEach(f=>D[f].forEach(c=>{const tr=CARD_I18N[l][c.id];
    if(!tr){errs.push(l+": missing card "+c.id);return}
    if(!tr[0])errs.push(l+": empty card name "+c.id);
    if(c.cat!=="C"&&!tr[1])errs.push(l+": empty card desc "+c.id);
    tr.forEach(s=>{if(CJK.test(s))errs.push(l+": CJK in card "+c.id+" -> "+s)})}));
});
const ids={};Object.keys(D).forEach(f=>D[f].forEach(c=>{if(ids[c.id])errs.push("duplicate card id "+c.id);ids[c.id]=1}));
if(errs.length){console.log(errs.join("\n"));console.log("FAIL "+errs.length);process.exit(1)}
console.log("i18n OK: "+Object.keys(ids).length+" cards, keys checked for en/pt");
