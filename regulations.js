// 법령 기준값 — 개정 시 이 파일의 값만 수정. 금액(급여 상한·지원금)은 의도적으로 넣지 않음.
(function(g){const M=g.MP=g.MP||{};
M.REG={
 updated:'2026-11-05', // 화면 우상단 '최종 업데이트' 표시값 — 배포 시 수정
 asOf:'2026-11-05 확인 (근로기준법 2025.2.23. 시행분 반영 — 반드시 국가법령정보센터에서 최신 개정 확인)',
 // preBefore: 예정일 기준 휴가 시작 오프셋(예정일-44일 시작 → 출산 후 45일 확보)
 maternity:{
  single:{label:'단태아',total:90,post:45,preBefore:44},
  premature:{label:'미숙아(출산 후 요건 확인)',total:100,post:45,preBefore:44},
  multiple:{label:'다태아',total:120,post:60,preBefore:59}},
 pregnancy:{earlyEndDay:84,lateStartDay:218,edd2lmp:280}, // 12주0일=84일, 31주1일=218일(임신 경과일수)
 parental:{defaultMonths:12},
 law:{
  main:'근로기준법 제74조(출산전후휴가·임신기 근로시간 단축)',
  mainUrl:'https://www.law.go.kr/법령/근로기준법',
  prem:'근로기준법 시행규칙 제12조의2(미숙아의 범위)',
  premUrl:'https://korea.legal/wiki/%ea%b7%bc%eb%a1%9c%ea%b8%b0%ec%a4%80%eb%b2%95-%ec%8b%9c%ed%96%89%ea%b7%9c%ec%b9%99-%ec%a0%9c12%ec%a1%b0%ec%9d%982/',
  shortUrl:'https://www.korea.kr/news/policyNewsView.do?newsId=148940076',
  gender:'남녀고용평등과 일·가정 양립 지원에 관한 법률(육아휴직)',
  genderUrl:'https://www.law.go.kr/법령/남녀고용평등과일ㆍ가정양립지원에관한법률',
  moel:'https://www.moel.go.kr'}
};})(typeof window!=='undefined'?window:globalThis);
