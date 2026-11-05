// 임신기 단축·출산전후휴가·육아휴직 계산 엔진 (UI 무관, 순수 함수)
// i: {edd,birth,multiple,premature,highRisk,wk,wd,wref,months,linked,hours}  ov: 수동수정값
(function(g){const M=g.MP=g.MP||{},D=M.date,R=M.REG;
M.calc=function(i,ov){ov=ov||{};const W=[],rows=[];
 if(!D.valid(i.edd))return{rows:[],warnings:['출산예정일을 입력하세요.'],ok:false};
 const kind=i.multiple?'multiple':(i.premature&&D.valid(i.birth)?'premature':'single'),r=R.maternity[kind];
 if(i.premature&&!D.valid(i.birth)&&!i.multiple)W.push('미숙아 여부는 실제 출산일 입력 후 증빙 확인하여 적용합니다. 현재는 90일 기준입니다.');
 if(i.premature&&i.multiple)W.push('다태아+미숙아 중복 적용 기준은 자동 확정하지 않습니다. 120일 기준이며 별도 확인이 필요합니다.');
 const lA=D.add(i.edd,-r.preBefore),eA=D.add(lA,r.total-1);
 const lS=ov.lStart||lA,lE=ov.lEnd||eA;
 const eddLmp=D.add(i.edd,-R.pregnancy.edd2lmp);let lmp=eddLmp;
 if(D.valid(i.wref)&&i.wk!==''&&i.wk!=null){lmp=D.add(i.wref,-(Number(i.wk)*7+Number(i.wd||0)));
  const df=D.diff(eddLmp,lmp);if(df!==0)W.push(`입력한 임신 주수 기준 임신 시작일이 예정일 역산(280일)보다 ${Math.abs(df)}일 ${df>0?'늦습니다':'빠릅니다'}. 의료기관 확인 주수를 우선 적용했습니다.`);}
 const sEnd=D.add(lS,-1),P=R.pregnancy,hrs=Number(i.hours)>=8?'1일 2시간 단축':'1일 근로시간 6시간까지 단축 허용 가능';
 const row=(key,label,s,e,basis,man,extra)=>rows.push(Object.assign({key,label,start:s,end:e,days:D.days(s,e),basis,manual:!!man},extra||{}));
 if(i.highRisk){W.push('고위험 임신: 의사 진단 등 법정 요건 확인 전에는 확정되지 않습니다. 진단서·질환 확인 후 적용하세요.');
  row('sAll','임신기 근로시간 단축(고위험: 전 기간)',ov.sAllS||lmp,ov.sAllE||sEnd,`임신 전 기간(의사 진단 시) · ${hrs}`,ov.sAllS||ov.sAllE);}
 else{row('sEarly','임신기 근로시간 단축(초기)',ov.sEarlyS||lmp,ov.sEarlyE||D.add(lmp,P.earlyEndDay),`임신 12주 이내(임신 84일까지) · ${hrs}`,ov.sEarlyS||ov.sEarlyE);
  row('sLate','임신기 근로시간 단축(후기)',ov.sLateS||D.add(lmp,P.lateStartDay),ov.sLateE||sEnd,`임신 32주 이후(임신 31주 1일=218일째부터) · ${hrs}`,ov.sLateS||ov.sLateE);}
 row('leave','출산전후휴가',lS,lE,`${r.label} 총 ${r.total}일, 출산 후 ${r.post}일 이상 확보`,ov.lStart||ov.lEnd,{note:R.law.main});
 const hasB=D.valid(i.birth),ref=hasB?i.birth:i.edd,bs=hasB?'실제 출산일':'출산예정일',post=D.diff(ref,lE),early=D.diff(lS,ref)<0;
 const chk={post,min:r.post,basis:bs,ok:post>=r.post&&!early};
 if(!chk.ok){const e3=D.add(early?ref:lS,r.total-1),e4=D.parse(D.add(ref,r.post))>D.parse(e3)?D.add(ref,r.post):e3,s2=D.add(e4,-(r.total-1));
  W.push(`${bs} 기준 출산 후 확보기간이 ${post}일로 법정 최소(${r.post}일)에 미달하거나 ${bs}이 휴가 시작 전입니다. 권고: ${s2} ~ ${e4} (총 ${r.total}일, 사용자 확인 후 적용).`);
  rows.find(x=>x.key==='leave').suggest={start:s2,end:e4};}
 const m=Number(i.months)||R.parental.defaultMonths,link=i.linked!==false;
 const pA=D.add(link?lE:eA,1),pS=ov.pStart||pA,pE=ov.pEnd||D.add(D.addMonths(pS,m),-1);
 row('parental','육아휴직',pS,pE,`${m}개월 · 출산전후휴가 종료일 다음 날 연속 사용 기본`,ov.pStart||ov.pEnd,{note:R.law.gender});
 if(pS!==D.add(lE,1))W.push('연속 사용 일정에서 벗어남: 출산전후휴가 종료일 다음 날과 육아휴직 시작일이 다릅니다. (연차 사용 시나리오는 V1.0 미지원)');
 if(D.diff(pS,pE)<0)W.push('육아휴직 종료일이 시작일보다 빠릅니다.');
 return{rows,warnings:W,ok:true,kind,lmp,chk,end:rows[rows.length-1].end};};
})(typeof window!=='undefined'?window:globalThis);
