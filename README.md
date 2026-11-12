# 모성보호 일정추출기 (Maternity HR Planner) V1.0

서버 없이 브라우저에서 동작하는 정적 웹앱입니다.

## 배포 구조 (happybirth.com)
- `/` → `index.html` (일반직원용: HR 전용 코드·화면이 아예 로드되지 않음)
- `/bluelight/` → `bluelight/index.html` (HR용: 체크리스트·급여/보험 참고·엑셀)
- 정적 호스팅(Netlify, GitHub Pages, S3+CloudFront, 일반 웹호스팅)에 폴더째 올리면 됩니다.
  `/bluelight`(슬래시 없음) 접속이 `/bluelight/`로 연결되는지 호스팅에서 확인하세요.
- **주의**: URL 분리는 접근 통제가 아닙니다. 주소를 아는 사람은 누구나 열 수 있습니다.
  HR 페이지는 noindex 처리했으나 robots.txt에 경로를 적지 마세요(경로가 노출됩니다).
  진짜 접근 제한이 필요하면 호스팅의 Basic Auth/IP 제한/SSO를 사용하세요.

## 실행/테스트
- 로컬: 폴더에서 `python3 -m http.server` 후 `http://localhost:8000/`, `/bluelight/`
- 계산 테스트: `node tests/test-cases.js`
- 엑셀 생성은 SheetJS(cdnjs, xlsx 0.18.5)를 쓰므로 인터넷 연결이 필요합니다(HR 페이지만).

## 법령 기준 관리
`js/regulations.js` 한 곳에서 일수·주수·링크를 관리합니다. 개정 시 이 값만 고치세요(계산 로직 수정 불필요).
급여 상한·지원금 금액·4대보험 신고기한은 의도적으로 넣지 않았습니다.

## 파일
`js/date-utils.js` 날짜 / `js/leave-calculator.js` 임신기 단축·출산휴가·육아휴직 계산 / `js/app.js` UI /
`js/hr-checklist.js`·`js/excel-export.js`·`js/hr-storage.js`(JSON 저장/불러오기) HR 전용 / `tests/test-cases.js` 단위 테스트
