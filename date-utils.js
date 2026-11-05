// 날짜 공통 함수: 'YYYY-MM-DD' 문자열 <-> UTC 일수 (타임존/DST 영향 없음)
(function(g){const M=g.MP=g.MP||{};
const P=s=>{const[a,b,c]=s.split('-').map(Number);return Date.UTC(a,b-1,c)/864e5};
const F=n=>new Date(n*864e5).toISOString().slice(0,10);
M.date={
 parse:P,fmt:F,
 valid:s=>/^\d{4}-\d\d-\d\d$/.test(s||'')&&F(P(s))===s,
 add:(s,n)=>F(P(s)+n),
 diff:(a,b)=>P(b)-P(a),            // b-a (일)
 days:(a,b)=>P(b)-P(a)+1,          // 시작일·종료일 포함 일수
 addMonths(s,m){let[y,mo,d]=s.split('-').map(Number);let t=mo-1+m;y+=Math.floor(t/12);t=((t%12)+12)%12;
  const last=new Date(Date.UTC(y,t+1,0)).getUTCDate();return F(Date.UTC(y,t,Math.min(d,last))/864e5)},
 serial:s=>P(s)+25569              // Excel 날짜 일련번호
};})(typeof window!=='undefined'?window:globalThis);
