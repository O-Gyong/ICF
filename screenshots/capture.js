/**
 * README용 화면 캡처 스크립트.
 *
 * 대시보드·일정·규칙·로스터는 선수 이름과 경기 장소가 노출되므로, Firebase CDN을 차단해
 * 앱을 로컬 캐시 모드로 띄우고 아래 더미 데이터를 localStorage에 심은 뒤 촬영한다.
 * 스킬·전술은 개인정보가 없어 실제 Firebase 데이터 그대로 촬영한다.
 *
 *   npm i puppeteer-core
 *   python -m http.server 8123      # 프로젝트 루트에서
 *   node screenshots/capture.js
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://localhost:8123/index.html';
const OUT = process.argv[2] || __dirname;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 데모용 더미 데이터 (실제 팀 정보 아님) ----
const P = ['홍길동', '김철수', '이영희', '박민수', '최지훈', '정우진', '강민재', '윤서준', '임도현', '오성민'];
const POS = ['가드', '가드', '포워드', '센터', '가드', '포워드', '센터', '가드', '포워드', '가드'];
const NUM = ['3', '5', '7', '8', '10', '11', '13', '21', '23', '32'];

const DUMMY = {
  roster: P.map((name, i) => ({
    id: `r${i + 1}`, name, number: NUM[i], position: POS[i], height: '', strengths: '',
  })),
  schedule: [
    { id: 's1', opponent: '샘플 클럽 정기전', date: '2026-08-15', time: '10:00~12:00', location: '중앙체육관 제1경기장', participants: P.slice(0, 8).join(', '), finished: false, ourScore: null, oppScore: null },
    { id: 's2', opponent: '연습 경기 (내전)', date: '2026-08-29', time: '19:00~21:00', location: '시립체육관 보조경기장', participants: P.slice(0, 10).join(', '), finished: false, ourScore: null, oppScore: null },
    { id: 's3', opponent: '가을 리그 예선', date: '2026-09-12', time: '13:00~15:00', location: '올림픽 제2체육관', participants: '참가자 미정', finished: false, ourScore: null, oppScore: null },
    { id: 's4', opponent: '샘플대 동아리 교류전', date: '2026-07-18', time: '10:00~12:00', location: '중앙체육관 제2경기장', participants: P.slice(0, 9).join(', '), finished: true, ourScore: 58, oppScore: 52 },
    { id: 's5', opponent: '연습 경기 (내전)', date: '2026-07-04', time: '20:00~22:00', location: '시립체육관 보조경기장', participants: P.slice(0, 8).join(', '), finished: true, ourScore: 44, oppScore: 47 },
  ],
  skills: [
    { id: 'k1', category: '슈팅', name: '자유투 루틴화', desc: '자유투 성공률 75% 이상 유지하기', checked: true },
    { id: 'k2', category: '슈팅', name: '캐치 앤 슛', desc: '무빙 후 정지 상태에서 빠른 릴리즈 슛', checked: false },
    { id: 'k3', category: '드리블', name: '크로스오버', desc: '낮고 빠른 볼 전환으로 상대 중심 무너뜨리기', checked: true },
    { id: 'k4', category: '드리블', name: '비하인드 백 / 레그스루', desc: '압박 수비 상황에서 안정적으로 볼 소유하기', checked: false },
    { id: 'k5', category: '패스', name: '엔트리 패스', desc: '포스트업한 센터에게 적시에 볼 찔러넣기', checked: false },
    { id: 'k6', category: '패스', name: '바운스 패스', desc: '밀착 수비 발밑 공간을 노리는 기본 바운드 패스', checked: true },
    { id: 'k7', category: '수비', name: '슬라이드 스텝', desc: '돌파하는 상대의 길을 선점하는 잔발 스텝 수비', checked: false },
    { id: 'k8', category: '수비', name: '박스아웃 & 리바운드', desc: '슛 시도 시 상대를 밀어내고 리바운드 사수', checked: true },
    { id: 'k9', category: '팀 전술', name: '2-3 지역방어 로테이션', desc: '외곽 패스 이동에 따라 신속하게 자리를 메우는 팀 로테이션', checked: false },
    { id: 'k10', category: '팀 전술', name: '픽 앤 롤 (Pick & Roll)', desc: '스크리너와 핸들러의 유기적인 연계 오펜스', checked: true },
  ],
  rules: [
    { id: 'u1', title: '경기 시간', desc: '7분 4쿼터 경기(2심) / 1~3쿼터 1분 데드, 4쿼터 2분 풀데드 적용' },
    { id: 'u2', title: '경기구', desc: '몰텐 BG4550 (7호구)' },
    { id: 'u3', title: '파울 누적 퇴장', desc: '개인 파울 5회 퇴장, 테크니컬 파울 2회 즉시 퇴장' },
    { id: 'u4', title: '교체 규정', desc: '데드 상황에서만 교체 가능, 쿼터당 인원 제한 없음' },
  ],
  tactics: [
    { id: 't1', title: '하이 픽 앤 롤', desc: '탑에서 스크린을 걸고 롤맨이 골밑으로 파고드는 기본 공격 옵션', links: [], courtView: 'half', tokens: null, routes: [], media: [] },
    { id: 't2', title: '베이스라인 아웃 오브 바운즈', desc: '엔드라인 스로인 상황에서 스크린 두 번으로 슈터를 코너에 띄운다', links: [], courtView: 'half', tokens: null, routes: [], media: [] },
    { id: 't3', title: '2-3 지역방어 대응', desc: '하이포스트에 볼을 투입한 뒤 좌우 스킵 패스로 외곽을 흔드는 패턴', links: [], courtView: 'half', tokens: null, routes: [], media: [] },
  ],
  lineups: [
    { id: 'q1', quarter: '1쿼터', players: [P[0], P[1], P[2], P[3], P[4]].join(', ') },
    { id: 'q2', quarter: '2쿼터', players: [P[5], P[6], P[7], P[8], P[9]].join(', ') },
    { id: 'q3', quarter: '3쿼터', players: [P[0], P[2], P[4], P[6], P[8]].join(', ') },
    { id: 'q4', quarter: '4쿼터', players: [P[1], P[3], P[5], P[7], P[9]].join(', ') },
  ],
};

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };
const MOBILE = { width: 414, height: 896, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

/**
 * shots: [{ tab, file, viewport }]
 * dummy가 true면 Firebase를 차단하고 더미 데이터로, false면 실제 Firebase 데이터로 촬영한다.
 */
async function capture(browser, shots, dummy) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 200)));

  if (dummy) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const u = req.url();
      const isFirebase = u.includes('gstatic.com/firebasejs') || u.includes('firebaseio')
        || u.includes('googleapis.com/identitytoolkit') || u.includes('firestore');
      return isFirebase ? req.abort() : req.continue();
    });
    await page.evaluateOnNewDocument((data) => {
      for (const [k, v] of Object.entries(data)) localStorage.setItem(`hoop_${k}`, JSON.stringify(v));
    }, DUMMY);
  }

  let loaded = false;
  for (const { tab, file, viewport, prepare, prepareArg } of shots) {
    await page.setViewport(viewport);
    if (!loaded) {
      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
      loaded = true;
    } else {
      await page.reload({ waitUntil: 'networkidle2' });
    }
    await sleep(dummy ? 3000 : 4500);

    await page.click(`#nav-${tab}`);
    await sleep(tab === 'tactics' ? 2500 : 1200);
    if (prepare) {
      const note = await page.evaluate(prepare, prepareArg);
      if (note) console.log(`  ${file}: ${note}`);
      await sleep(2000);
    }

    // 첨부 사진은 Storage에서 늦게 도착하므로 모두 로드된 뒤에 찍는다.
    await page.evaluate(() => Promise.all(
      [...document.images].filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
    ));

    const out = path.join(OUT, file);
    await page.screenshot({ path: out });
    console.log(`saved ${file} (${dummy ? '더미' : '실제'} 데이터)`);
  }

  await page.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--force-device-scale-factor=2', '--hide-scrollbars', '--font-render-hinting=none'],
  });

  // 개인정보(선수 이름·일정·장소)가 노출되는 화면은 더미 데이터로 촬영한다.
  await capture(browser, [
    { tab: 'dashboard', file: 'dashboard.png', viewport: DESKTOP },
    { tab: 'schedule', file: 'schedule.png', viewport: DESKTOP },
    { tab: 'rules', file: 'rules.png', viewport: DESKTOP },
    { tab: 'roster', file: 'roster.png', viewport: DESKTOP },
    { tab: 'dashboard', file: 'mobile-dashboard.png', viewport: MOBILE },
  ], true);

  // 전술 탭은 그냥 열면 빈 보드만 나오므로, 아래 전술을 불러온 뒤 지정한 영역을 촬영한다.
  const TACTIC = '2-3 지역방어 깨는 기본세팅 제안';
  const showTactic = ({ title, target }) => {
    const list = (window.appData && window.appData.tactics) || [];
    const tactic = list.find((t) => t.title === title) || list[0];
    if (!tactic) return '저장된 전술 없음 — 빈 보드로 촬영';
    window.loadTacticToForm(tactic.id);
    // loadTacticToForm이 맨 위로 스크롤하므로, 찍고 싶은 영역으로 다시 맞춘다.
    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: 'instant' });
    }, 1200);
    return `'${tactic.title}' 불러옴`;
  };

  // 스킬·전술은 개인정보가 없어 실제 데이터 그대로 촬영한다.
  await capture(browser, [
    { tab: 'skills', file: 'skills.png', viewport: DESKTOP },
    {
      tab: 'tactics', file: 'tactics.png', viewport: DESKTOP,
      prepare: showTactic, prepareArg: { title: TACTIC, target: '.tactics-board-card' },
    },
    {
      tab: 'tactics', file: 'tactics-media.png', viewport: DESKTOP,
      prepare: showTactic, prepareArg: { title: TACTIC, target: '#tactic-board-media-container' },
    },
    {
      tab: 'tactics', file: 'mobile-tactics.png', viewport: MOBILE,
      prepare: showTactic, prepareArg: { title: TACTIC, target: '.tactics-board-card' },
    },
  ], false);

  await browser.close();
})();
