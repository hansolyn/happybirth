// [HR 전용] 직원별 입력값·수정 일정·체크리스트를 JSON 파일로 저장/불러오기 (서버 저장 없음, 사용자 PC에 파일로만 보관)
(function(){const M=window.MP,D=M.date,$=s=>document.querySelector(s),TAG='happybirth-planner',VER=1;
function save(){const i=M.app.inputs(),d=new Date(),ymd=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
 const data={app:TAG,version:VER,savedAt:d.toISOString(),
  inputs:{name:i.name,dept:i.dept,edd:i.edd,birth:i.birth,multiple:i.multiple,premature:i.premature,highRisk:i.highRisk,months:i.months,linked:i.linked},
  overrides:M.app.ov(),checklist:M.hr.getCl()};
 const fn=`${(i.name||'직원').replace(/[\\/:*?"<>|]/g,'_')}_모성보호일정_${ymd}.json`;
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function load(file){const rd=new FileReader();rd.onload=()=>{let d;try{d=JSON.parse(rd.result)}catch(e){alert('JSON 파일을 읽을 수 없습니다.');return}
  if(!d||d.app!==TAG||!d.inputs){alert('Happybirth Planner에서 저장한 파일이 아닙니다.');return}
  if(!D.valid(d.inputs.edd)){alert('저장 파일에 출산예정일이 없습니다.');return}
  if(d.version>VER)alert('더 최신 버전에서 저장한 파일입니다. 일부 항목이 복원되지 않을 수 있습니다.');
  M.app.load(d.inputs,d.overrides,()=>M.hr.setCl(d.checklist))};
 rd.onerror=()=>alert('파일을 읽지 못했습니다.');rd.readAsText(file,'utf-8')}
const f=document.createElement('input');f.type='file';f.accept='.json,application/json';f.hidden=true;document.body.appendChild(f);
f.onchange=()=>{if(f.files[0])load(f.files[0]);f.value=''};
$('#hrx').insertAdjacentHTML('afterbegin','<button class=sec id=sv type=button>저장</button>');$('#sv').onclick=save;
$('#hrload').innerHTML='<button class="sec mini" id=ld type=button>불러오기</button>';$('#ld').onclick=()=>f.click();})();
