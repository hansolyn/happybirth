// UI 제어 — 일반직원/HR 모드 공용. HR 전용 기능은 MP.hr(hr-checklist.js)가 로드된 페이지에서만 동작.
(function(){const M=window.MP,D=M.date,$=s=>document.querySelector(s),
esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={ov:{},cur:null},COL={sEarly:'#5DADE2',sLate:'#2BA8A2',sAll:'#2BA8A2',leave:'#EF6C4A',parental:'#1E8C86'};
const MAP={sEarly:['sEarlyS','sEarlyE'],sLate:['sLateS','sLateE'],sAll:['sAllS','sAllE'],leave:['lStart','lEnd'],parental:['pStart','pEnd']};
const v=id=>$('#'+id).value,c=id=>$('#'+id).checked;
const collect=()=>({edd:v('edd'),birth:v('birth'),multiple:v('multiple')==='1',premature:c('prem'),highRisk:c('hr'),
 months:v('months'),linked:c('linked'),...(M.hr?M.hr.read():{})});
function render(){const i=collect(),r=M.calc(i,st.ov);st.cur={i,r};
 $('#res').hidden=!r.ok;if(!r.ok){alert(r.warnings[0]);return}
 const L=r.rows.find(x=>x.key==='leave'),P=r.rows.find(x=>x.key==='parental');
 $('#sum').innerHTML=[['직원',i.name||'-'],['출산예정일',i.edd],['임신 유형',i.multiple?'다태아':'단태아'],
  ['출산전후휴가',`${L.start} ~ ${L.end}`],['육아휴직',`${P.start} ~ ${P.end}`],['전체 종료일',r.end]]
  .filter(x=>M.hr||x[0]!=='직원').map(([a,b])=>`<div class=sc><small>${a}</small><b>${esc(b)}</b></div>`).join('')
 $('#sum').innerHTML+=`<div class="sc ${r.chk.ok?'ok':'bad'}"><small>출산 후 확보일수 (${r.chk.basis} 기준)</small><b>${r.chk.post}일 / 최소 ${r.chk.min}일 ${r.chk.ok?'✔ 충족':'✖ 미달'}</b></div>`;
 $('#warns').innerHTML=r.warnings.map(w=>`<div class=warn>⚠ ${esc(w)}</div>`).join('');
 const a=Math.min(...r.rows.map(x=>D.parse(x.start))),z=Math.max(...r.rows.map(x=>D.parse(x.end))),sp=z-a||1,pc=n=>((D.parse(n)-a)/sp*100);
 const tk=[];{let y=new Date(a*864e5).getUTCFullYear(),m=new Date(a*864e5).getUTCMonth()+1;for(;;){const d=`${y}-${String(m).padStart(2,'0')}-01`;if(D.parse(d)>z)break;if(D.parse(d)>=a)tk.push([d,y,m]);m++;if(m>12){m=1;y++}}}
 $('#tl').innerHTML=`<div class=tlw><div class=tl>${tk.map(([d,y,m],n)=>`<div class=tk style="left:${pc(d)}%"><span>${n===0||m===1?y+'.'+String(m).padStart(2,'0'):m+'월'}</span></div>`).join('')}${r.rows.map(x=>`<div class=tr><div class=tb data-k="${x.key}" title="${x.start}~${x.end}" style="left:${pc(x.start)}%;width:${Math.max(pc(x.end)-pc(x.start),1.2)}%;background:${COL[x.key]}">${esc(x.label)}</div></div>`).join('')}<div class=edd style="left:${pc(i.edd)}%" title="출산예정일 ${i.edd}"></div></div></div>`;
 // 막대 안에 글자가 다 들어가지 않을 때만 막대 오른쪽에 이름 표시
 $('#tl').querySelectorAll('.tb').forEach(b=>{if(b.scrollWidth>b.clientWidth){const t=b.textContent,p=document.createElement('span');b.textContent='';p.className='tbo';p.dataset.k=b.dataset.k;p.textContent=t;p.style.left=(b.offsetLeft+b.offsetWidth+6)+'px';b.parentNode.appendChild(p)}});
 $('#tbody').innerHTML=r.rows.map(x=>`<tr><td>${esc(x.label)}</td><td>${x.start}</td><td>${x.end}</td><td>${x.key==='parental'?esc(i.months)+'개월':x.days+'일'}</td><td class="${x.manual?'man':'auto'}">${x.manual?'수동 수정':'자동'}</td><td>${esc(x.basis)}${['sEarly','sLate','sAll'].includes(x.key)?'*':''}</td><td><button class=sec data-k="${x.key}">수정</button></td></tr>`).join('');
 if(M.hr)M.hr.render(r,i,st);}
function edit(k){const x=st.cur.r.rows.find(y=>y.key===k),[ks,ke]=MAP[k];$('#dl-t').textContent=x.label+' 수정';$('#d-s').value=x.start;$('#d-e').value=x.end;
 $('#d-sg').innerHTML=x.suggest?`권고(실제 출산일 기준): ${x.suggest.start} ~ ${x.suggest.end} <button type=button class=sec id=sg>권고안 적용</button>`:'';
 if(x.suggest)$('#sg').onclick=()=>{$('#d-s').value=x.suggest.start;$('#d-e').value=x.suggest.end};
 $('#dlg').showModal();$('#d-save').onclick=e=>{const s=v('d-s'),en=v('d-e');if(!D.valid(s)||!D.valid(en)||D.diff(s,en)<0){alert('날짜를 확인하세요 (시작일 ≤ 종료일).');e.preventDefault();return}
  const ov=st.ov,cs=s!==x.start,ce=en!==x.end,lv=st.cur.r.rows.find(y=>y.key==='leave'),lk=st.cur.i.linked!==false;
  if(k==='leave'){if(cs){ov.lStart=s;ov.lEnd=ce?en:D.add(s,lv.days-1);delete ov.sLateE;delete ov.sAllE}else if(ce)ov.lEnd=en;if((cs||ce)&&lk){delete ov.pStart;delete ov.pEnd}}
  else if((k==='sLate'||k==='sAll')&&ce){if(cs)ov[ks]=s;ov[ke]=en;ov.lStart=D.add(en,1);ov.lEnd=D.add(ov.lStart,lv.days-1);if(lk){delete ov.pStart;delete ov.pEnd}}
  else{if(cs)ov[ks]=s;if(ce)ov[ke]=en}
  render()};
 $('#d-reset').onclick=()=>{delete st.ov[ks];delete st.ov[ke];$('#dlg').close();render()}}
document.addEventListener('click',e=>{const k=e.target.closest('[data-k]');if(k)edit(k.dataset.k)});
$('#go').onclick=()=>{st.ov={};render()};
['edd','birth','multiple','prem','hr','months','linked'].forEach(id=>$('#'+id).addEventListener('change',()=>{if(!$('#res').hidden){if(['edd','multiple','months'].includes(id))st.ov={};render()}}));
if(M.hr)M.hr.init(render);
$('#upd').textContent='최종 업데이트 '+M.REG.updated.replace(/-/g,'.');})();