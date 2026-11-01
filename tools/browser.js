// Browser playtest: 3 languages x desktop/mobile. Drives every screen with real taps/clicks,
// switches language mid-game, and fails on console errors, CJK text in en/pt, or horizontal overflow.
//   node tools/browser.js [outDir]
"use strict";
const {chromium,devices}=require("playwright");
const path=require("path"),fs=require("fs");
const URL="file://"+path.join(__dirname,"..","index.html");
const OUT=process.argv[2]||"/tmp/tw-shots";fs.mkdirSync(OUT,{recursive:true});
const CJK=/[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/;
const VIEWS={desktop:{viewport:{width:1280,height:800}},mobile:{...devices["iPhone 13"]}};
const problems=[];
function bad(m){problems.push(m);console.log("  ✗ "+m)}
async function run(){
  const browser=await chromium.launch();
  for(const [vn,vopt] of Object.entries(VIEWS)){
    for(const lang of ["zh","en","pt"]){
      const tag=vn+"-"+lang;console.log("== "+tag);
      const ctx=await browser.newContext(vopt);
      await ctx.addInitScript(l=>{try{localStorage.setItem("trinitywar.lang",l);localStorage.removeItem("trinitywar.save")}catch(e){}},lang);
      const page=await ctx.newPage();
      page.on("console",m=>{if(m.type()==="error"||m.type()==="warning")bad(tag+" console."+m.type()+": "+m.text())});
      page.on("pageerror",e=>bad(tag+" pageerror: "+e.message));
      const tap=async sel=>{const el=page.locator(sel).first();if(vn==="mobile")await el.tap();else await el.click()};
      const check=async where=>{
        const r=await page.evaluate(()=>{const t=document.body.innerText;return{t,ow:document.documentElement.scrollWidth>window.innerWidth+1,lang:window.LANG}});
        if(r.lang!=="zh"){const m=r.t.match(/.{0,20}[　-〿㐀-䶿一-鿿豈-﫿＀-￯].{0,20}/);if(m)bad(tag+" "+where+": CJK in "+r.lang+" UI: "+m[0].replace(/\n/g," "))}
        if(r.ow)bad(tag+" "+where+": horizontal overflow");
      };
      const shot=async n=>{await page.screenshot({path:path.join(OUT,tag+"-"+n+".png")})};
      await page.goto(URL);await page.waitForTimeout(200);
      await check("title");await shot("1-title");
      await tap("text=/📖/");await page.waitForTimeout(100);await check("rules");await shot("2-rules");
      await tap(".ov .cb");
      await tap("text=/📚/");await check("codex");await shot("3-codex");
      for(const i of [1,2]){await tap(".tabs .tab >> nth="+i);await check("codex"+i)}
      await tap(".menu .mb");
      await tap("text=/🐪/");await page.waitForTimeout(100);await check("prologue");await shot("4-prologue");
      await tap(".ov .mb");await check("camp");await shot("5-camp");
      await tap(".chb >> nth=1");await check("ch1-intro");await shot("6-ch1");
      await tap(".ov .mb");await page.waitForTimeout(200);await check("ch1-game");
      await page.evaluate(()=>restart());
      // quick match, play with taps
      await tap(".fb >> nth=0");await page.waitForTimeout(200);
      let turns=0,switched=0;
      for(let step=0;step<400&&turns<14;step++){
        const st=await page.evaluate(()=>({ph:S.ph,my:myTurn(),dsc:S.dsc,sel:S.sel&&S.sel.cat,tgt:S.tgt,atkN:S.atkN,
          hand:S.ps[0].hand.map(c=>({id:c.id,cat:c.cat,cost:c.cat==="A"?(S.frN?0:aCost(S.ps[0],c)):c.cost})),faith:S.ps[0].faith,
          slots:Object.fromEntries(["E","G","C","O","K"].map(k=>[k,S.ps[0][k].length])),ens:S.ps.filter(p=>!p.hu&&p.alive).map(p=>p.id)}));
        if(st.ph==="gameover"){await shot("8-gameover");await check("gameover");break}
        if(!st.my){await page.waitForTimeout(120);continue}
        if(st.dsc>0){await tap(".card >> nth=0");continue}
        const atk=st.hand.find(c=>c.cat==="A"&&c.cost<=st.faith);
        const fn=st.hand.find(c=>c.cat!=="A"&&c.cost<=st.faith&&!st.slots[c.cat]);
        if(fn){await tap('.card[onclick*="\''+fn.id+'\'"]');await tap(".act .ab >> nth=0");continue}
        if(atk&&st.atkN<3){await tap('.card[onclick*="\''+atk.id+'\'"]');
          const s2=await page.evaluate(()=>S.tgt);if(s2===null)await tap(".en >> nth="+(Math.random()<.5?0:1));
          await check("selected");if(turns===1)await shot("7-selected");
          await tap(".act .ab >> nth=0");continue}
        await tap("text=/⏭/");turns++;
        if(turns===3&&!switched){switched=1;
          // switch language mid-game via 🌐 three times and check the log every time
          for(let k=0;k<3;k++){await tap("text=🌐");await page.waitForTimeout(50);await check("lang-cycle"+k);
            const ok=await page.evaluate(()=>{const d=document.querySelector("#lb div");return d&&d.textContent===t("lgStart")});
            if(!ok)bad(tag+" log line 1 not re-translated after switching language")}
          const same=await page.evaluate(l=>LANG===l,lang);if(!same)bad(tag+" language cycle did not return");
          await shot("7b-afterswitch")}
      }
      if(turns<3)bad(tag+" only played "+turns+" turns");
      await page.evaluate(()=>restart());
      await tap("text=/👁/");await page.waitForTimeout(2500);await check("spectate");await shot("9-spec");
      await page.evaluate(()=>restart());
      // title screen language buttons: switch to the other two and back, cover must follow
      for(const l of ["zh","en","pt",lang]){await tap('.lg[onclick*="\''+l+'\'"]');await check("title-"+l);
        const cv=await page.evaluate(()=>[document.querySelector(".cvt").textContent,t("cvt").replace(/\|/g,""),document.querySelector(".lg.on").textContent,I18N[LANG].langN[LANG]]);
        if(cv[0]!==cv[1]||cv[2]!==cv[3])bad(tag+" title-"+l+": cover/lang button not localised "+cv.join(","))}
      await shot("1b-title-cover")
      await ctx.close();
    }
  }
  await browser.close();
  console.log(problems.length?"FAIL "+problems.length:"browser OK (0 console errors, no CJK in en/pt, no overflow)");
  process.exit(problems.length?1:0);
}
run().catch(e=>{console.error(e);process.exit(1)});
