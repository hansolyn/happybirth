// [HR 전용] 추가 입력, 체크리스트, 참고 안내. 일반직원 페이지(index.html)에서는 로드하지 않음.
(function(){const M=window.MP,D=M.date,R=M.REG,$=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ST=['미처리','진행 중','완료','해당 없음'];
// [분류, 업무명, 설명, 기준일(L0/L1 휴가 시작·종료, P0/P1 육아 시작·종료, E 예정일), 오프셋(일), 링크]
// 예정일은 내부 업무 목표일(법정 기한 아님). 금액·신고기한 등 변동 가능 수치는 넣지 않음.
const T=[
['신청 및 증빙','출산전후휴가 신청서 접수','휴가 시작 전 신청서 접수 및 취업규칙 양식 확인','L0',-14,R.law.mainUrl],
['신청 및 증빙','출산예정일 확인 자료 수령','진단서·임신확인서 등 예정일 확인 자료','L0',-14,''],
['신청 및 증빙','임신기 근로시간 단축 신청서·진단서 확인','신청 시 단축 시간·시작일 확인 (임금 삭감 불가)','E',-280+0,R.law.shortUrl],
['신청 및 증빙','고위험 임신 증빙 확인','의사 진단 등 법정 요건 확인 후 전 기간 단축 적용 여부 확정','E',-250,R.law.shortUrl],
['신청 및 증빙','실제 출산일 확인 및 휴가기간 재검증','출산 후 최소 확보기간(단태 45일/다태 60일) 충족 여부','E',0,R.law.mainUrl],
['신청 및 증빙','미숙아 증빙 확인(해당 시)','미숙아 범위 및 증빙서류 제출기한은 시행규칙 제12조의2 확인','L1',-7,R.law.premUrl],
['신청 및 증빙','육아휴직 신청서 접수','신청서 및 증빙 접수','P0',-30,R.law.genderUrl],
['급여 및 지원금','출산전후휴가 급여 지급 주체·부담기간 확인','회사 지급분과 고용보험 지원분 구분 (기업 유형별 상이)','L0',-7,R.moel],
['급여 및 지원금','고용보험 출산전후휴가 급여 신청 안내','신청 절차·서류를 고용노동부·고용보험 안내로 확인','L0',0,R.moel],
['급여 및 지원금','우선지원대상기업 지원금 요건 확인','해당 기업 여부 및 요건 최신 고시 확인','L0',0,R.moel],
['급여 및 지원금','육아휴직 급여 신청 안내','급여 상한·지급률은 최신 고시 확인(하드코딩 금지)','P0',0,R.moel],
['급여 및 지원금','급여 지급 및 정산 일정 확인','급여일 기준 정산 일정 점검','L0',0,''],
['4대 보험','출산전후휴가 기간 보험별 신고·납부 확인','보험별 신고사유·기한이 다르므로 각각 확인','L0',0,''],
['4대 보험','육아휴직 시작에 따른 보험별 신고 확인','출산전후휴가와 육아휴직을 동일한 휴직으로 보지 않음','P0',0,''],
['4대 보험','복직 시 보험별 처리 확인','복직일 기준 보험별 처리','P1',1,''],
['인사관리','복직 예정일 확인','','P1',-30,''],
['인사관리','복직 전 안내','','P1',-14,''],
['인사관리','복직 후 근로조건 확인','복직 전 동일 업무 또는 동등 수준 임금 직무 복귀 여부 확인','P1',1,R.law.genderUrl]];
const cl={};let cur=null;
function anchor(a,r,i){const g=k=>r.rows.find(x=>x.key===k),l=g('leave'),p=g('parental');
 return({L0:l.start,L1:l.end,P0:p.start,P1:p.end,E:i.edd})[a]}
function build(r,i){return T.map((t,n)=>{const id=t[1],o=cl[id]||(cl[id]={done:false,date:null});
 return{cat:t[0],name:t[1],desc:t[2],auto:D.add(anchor(t[3],r,i),t[4]),link:t[5],o}})}
const eff=x=>x.o.date||x.auto;
function draw(){const items=cur.items;items.sort((a,b)=>eff(a).localeCompare(eff(b)));
 $('#cl').innerHTML=`<table><tr><th>완료</th><th>분류</th><th>업무</th><th>예정일(내부 목표)</th><th>근거</th></tr>`+items.map((x,n)=>`<tr${x.o.done?' style="opacity:.55"':''}><td><input type=checkbox data-c="${n}" data-f=done${x.o.done?' checked':''}></td><td>${x.cat}</td><td><b>${esc(x.name)}</b><br><span class=note>${esc(x.desc)}</span></td><td><input type=date data-c="${n}" data-f=date value="${eff(x)}"></td><td>${x.link?`<a href="${x.link}" target=_blank rel=noopener>링크</a>`:''}</td></tr>`).join('')+'</table>';
 $('#cl').onchange=e=>{const d=e.target.dataset;if(d.c==null)return;const it=items[d.c];if(d.f==='done'){it.o.done=e.target.checked;draw()}else if(D.valid(e.target.value)){it.o.date=e.target.value;draw()}}}
M.hr={
 init(render){$('#hrf').innerHTML=`<label>직원명<input id=name></label><label>부서<input id=dept></label>`;$('#hrf2').innerHTML=`<label>기업 유형*<select id=corp><option>우선지원대상기업</option><option>그 외</option></select></label>`;
  $('#hrx').innerHTML=`<button class=or id=xl>엑셀 다운로드</button>`;
  $('#xl').onclick=()=>M.excel(cur);['name','dept','corp'].forEach(id=>$('#'+id).addEventListener('change',()=>$('#res').hidden||render()))},
 read:()=>({name:$('#name').value,dept:$('#dept').value,corp:$('#corp').value}),
 render(r,i,st){cur={r,i,items:build(r,i)};draw();
  $('#ref').innerHTML=`<ul><li>적용 기준일: ${esc(R.asOf)}</li><li>${esc(R.law.main)} — <a href="${R.law.mainUrl}" target=_blank rel=noopener>국가법령정보센터</a></li>
  <li>임신기 단축 개정(2025.2.23.) 안내 — <a href="${R.law.shortUrl}" target=_blank rel=noopener>정책브리핑</a></li><li>미숙아 범위 — <a href="${R.law.premUrl}" target=_blank rel=noopener>${esc(R.law.prem)}</a></li>
  <li>급여 상한액·지원금 금액·4대 보험 신고기한은 고시·공단 안내가 수시 변경되므로 이 도구에 고정하지 않았습니다. <a href="${R.law.moel}" target=_blank rel=noopener>고용노동부</a> 및 각 보험 공단 최신 안내 확인.</li></ul>`}};
M.hrItems=()=>cur;})();
