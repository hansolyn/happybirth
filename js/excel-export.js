// [HR 전용] SheetJS(xlsx) 엑셀 생성. 날짜는 일련번호+yyyy-mm-dd 서식으로 저장.
(function(){const M=window.MP,D=M.date,R=M.REG;
M.excel=function(cur){if(!cur||!window.XLSX){alert('일정을 먼저 생성하세요 (또는 SheetJS 로드 실패).');return}
 const X=XLSX,{r,i,items}=cur,dt=s=>({t:'n',v:D.serial(s),z:'yyyy-mm-dd'}),g=k=>r.rows.find(x=>x.key===k),L=g('leave'),P=g('parental');
 const sh=aoa=>{const w=X.utils.aoa_to_sheet(aoa);w['!cols']=aoa[0].map(()=>({wch:24}));return w};
 const s1=sh([['항목','내용'],['직원명',i.name||''],['부서',i.dept||''],['기업 유형',i.corp],['출산예정일',dt(i.edd)],['실제 출산일',i.birth?dt(i.birth):''],['임신 유형',i.multiple?'다태아':'단태아'],
  ['출산전후휴가 기간',`${L.start} ~ ${L.end} (${L.days}일)`],['육아휴직 기간',`${P.start} ~ ${P.end}`],['전체 일정 종료일',dt(r.end)],['※ 경고/확인사항',r.warnings.join(' / ')]]);
 const s2=sh([['구분','시작일','종료일','기간(일)','자동/수동','적용 제도·근거','비고'],...r.rows.map(x=>[x.label,dt(x.start),dt(x.end),x.days,x.manual?'수동 수정':'자동',x.basis,x.note||''])]);
 const s3=sh([['업무 카테고리','업무명','상세 내용','예정일','완료','참고 링크'],...items.map(x=>[x.cat,x.name,x.desc,dt(x.o.date||x.auto),x.o.done?'완료':'미완료',x.link])]);
 const s4=sh([['구분','내용'],['적용 법령 기준일',R.asOf],['출산전후휴가·임신기 단축',R.law.main],['법령 링크',R.law.mainUrl],['미숙아 범위',R.law.premUrl],['임신기 단축 개정 안내',R.law.shortUrl],['육아휴직',R.law.gender],['육아휴직 법령 링크',R.law.genderUrl],
  ['급여·지원금','금액·상한은 고시 개정에 따라 변동 — 고용노동부 최신 안내 확인'],['4대 보험','보험별 신고사유·기한이 다름 — 각 공단 안내 확인']]);
 const wb=X.utils.book_new();[['일정 요약',s1],['상세 일정표',s2],['HR 업무 체크리스트',s3],['급여·보험 참고',s4]].forEach(([n,s])=>X.utils.book_append_sheet(wb,s,n));
 X.writeFile(wb,`모성보호_일정관리_${i.name||'직원'}_${i.edd.slice(0,4)}.xlsx`);};})();
