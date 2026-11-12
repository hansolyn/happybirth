// UI 제어 — 일반직원/HR 모드 공용. HR 전용 기능은 MP.hr(hr-checklist.js)가 로드된 페이지에서만 동작.
(function(){const M=window.MP,D=M.date,$=s=>document.querySelector(s),
esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
dd=s=>String(s).replace(/(\d{4})-(\d\d)-(\d\d)/g,'$1.$2.$3');   // 화면 표시용 2026.10.13 형식
const st={ov:{},cur:null},COL={sEarly:'#E8890C',sLate:'#D9480F',sAll:'#D9480F',leave:'#364FC7',parental:'#2B8A63'};
const MAP={sEarly:['sEarlyS','sEarlyE'],sLate:['sLateS','sLateE'],sAll:['sAllS','sAllE'],leave:['lStart','lEnd'],parental:['pStart','pEnd']};
const v=id=>$('#'+id).value,c=id=>$('#'+id).checked;
const collect=()=>({edd:v('edd'),birth:v('birth'),multiple:v('multiple')==='1',premature:c('prem'),highRisk:c('hr'),
 months:v('months'),linked:c('linked'),...(M.hr?M.hr.read():{})});
function show(result){$('#res').hidden=!result;$('#inp').hidden=result;window.scrollTo(0,0)}
function render(){const i=collect(),r=M.calc(i,st.ov);st.cur={i,r};
 if(!r.ok){alert(r.warnings[0]);return}
 if($('#res').hidden)show(true);
 const L=r.rows.find(x=>x.key==='leave'),P=r.rows.find(x=>x.key==='parental');
 {const t=[M.hr&&i.name?i.name:'',i.multiple?'다태아':''].filter(Boolean).join(' · ');$('#rs').textContent=t;$('#rs').hidden=!t}
 const hb=D.valid(i.birth);
 const linked=P.start===D.add(L.end,1);
 $('#sum').innerHTML=[[hb?'실제 출산일':'출산예정일',dd(hb?i.birth:i.edd),'입력 기준'],['출산전후휴가',`${dd(L.start)} ~ ${dd(L.end)}`,L.days+'일'],
  ['육아휴직 시작',dd(P.start),linked?'출산휴가 종료 다음 날':'직접 조정한 일정'],['육아휴직 종료',dd(P.end),i.months+'개월 기준']]
  .map(([a,b,s])=>`<div class=sc><small>${a}</small><b>${b}</b><span>${s}</span></div>`).join('');
 $('#chk').innerHTML=`<div class="chk ${r.chk.ok?'ok':'bad'}">출산 후 확보일수 ${r.chk.post}일 / 최소 ${r.chk.min}일 ${r.chk.ok?'✔ 충족':'✖ 미달'}<em>(${r.chk.basis} 기준)</em></div>`;
 $('#warns').innerHTML=r.warnings.map(w=>`<div class=warn>⚠ ${esc(dd(w))}</div>`).join('');
 $('#key').innerHTML=r.rows.map(x=>`<div class=kc data-k="${x.key}" style="border-top-color:${COL[x.key]}"><small>${esc(x.label)}</small><b>${dd(x.start)}</b><span>종료 ${dd(x.end)}</span></div>`).join('');
 const a=Math.min(...r.rows.map(x=>D.parse(x.start))),z=Math.max(...r.rows.map(x=>D.parse(x.end))),sp=z-a||1,pc=n=>((D.parse(n)-a)/sp*100);
 const tk=[];{let y=new Date(a*864e5).getUTCFullYear(),m=new Date(a*864e5).getUTCMonth()+1;for(;;){const d=`${y}-${String(m).padStart(2,'0')}-01`;if(D.parse(d)>z)break;if(D.parse(d)>=a)tk.push([d,y,m]);m++;if(m>12){m=1;y++}}}
 $('#tl').innerHTML=`<div class=tlw><div class=tl>${tk.map(([d,y,m],n)=>`<div class=tk style="left:${pc(d)}%"><span>${n===0||m===1?y+'.'+String(m).padStart(2,'0'):m+'월'}</span></div>`).join('')}${r.rows.map(x=>`<div class=tr><div class=tb data-k="${x.key}" title="${dd(x.start)}~${dd(x.end)}" style="left:${pc(x.start)}%;width:${Math.max(pc(x.end)-pc(x.start),1.2)}%;background:${COL[x.key]}">${esc(x.label)}</div></div>`).join('')}<div class=edd style="left:${pc(hb?i.birth:i.edd)}%" title="${hb?'실제 출산일':'출산예정일'} ${dd(hb?i.birth:i.edd)}"></div></div></div>`;
 // 막대 안에 글자가 다 들어가지 않을 때만 막대 오른쪽에 이름 표시
 $('#tl').querySelectorAll('.tb').forEach(b=>{if(b.scrollWidth>b.clientWidth){const t=b.textContent,p=document.createElement('span');b.textContent='';p.className='tbo';p.dataset.k=b.dataset.k;p.textContent=t;p.style.left=(b.offsetLeft+b.offsetWidth+6)+'px';b.parentNode.appendChild(p)}});
 $('#tbody').innerHTML=r.rows.map(x=>`<tr><td><b>${esc(x.label)}</b></td><td>${dd(x.start)}</td><td>${dd(x.end)}</td><td>${x.key==='parental'?esc(i.months)+'개월':x.days+'일'}</td><td><span class="pill${x.manual?' man':''}">${x.manual?'수동 수정':'자동 계산'}</span></td><td class=basis>${esc(x.basis)}${['sEarly','sLate','sAll'].includes(x.key)?'\u2060*':''}</td><td class="noprint"><button class="sec mini" data-k="${x.key}">수정</button></td></tr>`).join('');
 if(M.hr)M.hr.render(r,i,st);}
function edit(k){const x=st.cur.r.rows.find(y=>y.key===k),[ks,ke]=MAP[k];$('#dl-t').textContent=x.label+' 수정';$('#d-s').value=x.start;$('#d-e').value=x.end;
 $('#d-sg').innerHTML=x.suggest?`권고(${esc(st.cur.r.chk.basis)} 기준): ${dd(x.suggest.start)} ~ ${dd(x.suggest.end)} <button type=button class="sec mini" id=sg>권고안 적용</button>`:'';
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
$('#back').onclick=()=>show(false);
$('#reset').onclick=()=>{st.ov={};['edd','birth','name','dept'].forEach(id=>{if($('#'+id))$('#'+id).value=''});$('#multiple').value='0';$('#months').value='12';
 $('#prem').checked=false;$('#hr').checked=false;$('#linked').checked=true;if(M.hr&&M.hr.setCl)M.hr.setCl({})};
// HR 저장/불러오기(hr-storage.js)에서 쓰는 최소 연결점
M.app={inputs:collect,ov:()=>JSON.parse(JSON.stringify(st.ov)),
 load(inp,ov,after){$('#reset').onclick();if(after)after();const set=(id,val)=>{if($('#'+id)&&val!=null)$('#'+id).value=val};
  ['edd','birth','months','name','dept'].forEach(k=>set(k,inp[k]));$('#multiple').value=inp.multiple?'1':'0';
  $('#prem').checked=!!inp.premature;$('#hr').checked=!!inp.highRisk;$('#linked').checked=inp.linked!==false;st.ov=ov||{};render()}};
if(M.hr)M.hr.init(render);
$('#upd').textContent='최종 업데이트 '+M.REG.updated.replace(/-/g,'.');})();
