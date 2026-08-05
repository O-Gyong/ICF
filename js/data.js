// ================= INITIAL STATE & DATA CONFIGURATION =================

// 로스터/일정/라인업 기본값은 비워둡니다.
// 실데이터는 Firestore에서 관리되며, 이 값은 빈 DB 최초 시드와 전체 리셋 시에만 사용됩니다.
export const DEFAULT_ROSTER = [];

export const DEFAULT_SCHEDULE = [];

export const DEFAULT_SKILLS = [
  { id: 'k1', category: '슈팅', name: '자유투 루틴화', desc: '자유투 성공률 75% 이상 유지하기', checked: true },
  { id: 'k2', category: '슈팅', name: '캐치 앤 슛', desc: '무빙 후 정지 상태에서 빠른 릴리즈 슛', checked: false },
  { id: 'k3', category: '드리블', name: '크로스오버', desc: '낮고 빠른 볼 전환으로 상대 중심 무너뜨리기', checked: true },
  { id: 'k4', category: '드리블', name: '비하인드 백/레그스루', desc: '압박 수비 상황에서 안정적으로 볼 소유하기', checked: false },
  { id: 'k5', category: '패스', name: '엔트리 패스', desc: '포스트업한 센터에게 적시에 볼 찔러넣기', checked: false },
  { id: 'k6', category: '패스', name: '바운스 패스', desc: '밀착 수비 발밑 공간을 노리는 기본 바운드 패스', checked: true },
  { id: 'k7', category: '수비', name: '대인 방어 슬라이드 step', desc: '돌파하는 상대의 길을 선점하는 잔발 스텝 수비', checked: false },
  { id: 'k8', category: '수비', name: '박스아웃 & 리바운드', desc: '슛 시도 시 상대를 엉덩이로 밀어내고 리바운드 사수', checked: true },
  { id: 'k9', category: '팀 전술', name: '2-3 지역방어 로테이션', desc: '외곽 패스 이동에 따라 신속하게 자리를 메우는 팀 로테이션', checked: false },
  { id: 'k10', category: '팀 전술', name: '픽 앤 롤 (Pick & Roll)', desc: '스크리너와 핸들러의 유기적인 연계 오펜스', checked: false }
];

export const DEFAULT_RULES = [
  { id: 'u1', title: '경기 시간', desc: '7분 4Q 경기(2심) / 1~3쿼터 1분 데드 적용, 4쿼터 2분 풀데드 적용' },
  { id: 'u2', title: '경기구', desc: '몰텐 BG4550' },
  { id: 'u3', title: '파울 누적 퇴장', desc: '개인 파울 5회 퇴장 (테크니컬 파울 2회 즉시 퇴장)' }
];

export const DEFAULT_TACTICS = [];

export const DEFAULT_LINEUPS = [
  { id: 'q1', quarter: '1쿼터', players: '' },
  { id: 'q2', quarter: '2쿼터', players: '' },
  { id: 'q3', quarter: '3쿼터', players: '' },
  { id: 'q4', quarter: '4쿼터', players: '' }
];

export const DATA_KEYS = ['roster', 'schedule', 'skills', 'rules', 'tactics', 'lineups'];

export const DATA_DEFAULTS = {
  roster: DEFAULT_ROSTER,
  schedule: DEFAULT_SCHEDULE,
  skills: DEFAULT_SKILLS,
  rules: DEFAULT_RULES,
  tactics: DEFAULT_TACTICS,
  lineups: DEFAULT_LINEUPS
};

export const appData = {
  roster: [],
  schedule: [],
  skills: [],
  rules: [],
  tactics: [],
  lineups: []
};

export const defaultTokenPositions = {
  half: [
    { id: 'token-off-pg', label: '1', role: 'PG (포인트 가드)', type: 'offense', x: 60, y: 38 },
    { id: 'token-off-sg', label: '2', role: 'SG (슈팅 가드)', type: 'offense', x: 48, y: 77 },
    { id: 'token-off-sf', label: '3', role: 'SF (스몰 포워드)', type: 'offense', x: 43, y: 12 },
    { id: 'token-off-pf', label: '4', role: 'PF (파워 포워드)', type: 'offense', x: 35, y: 58 },
    { id: 'token-off-c', label: '5', role: 'C (센터)', type: 'offense', x: 35, y: 92 },

    { id: 'token-def-d1', label: '1', role: '수비 1', type: 'defense', x: 52, y: 39 },
    { id: 'token-def-d2', label: '2', role: '수비 2', type: 'defense', x: 48, y: 69 },
    { id: 'token-def-d3', label: '3', role: '수비 3', type: 'defense', x: 28, y: 13 },
    { id: 'token-def-d4', label: '4', role: '수비 4', type: 'defense', x: 32, y: 50 },
    { id: 'token-def-d5', label: '5', role: '수비 5', type: 'defense', x: 32, y: 85 },

    { id: 'token-ball', label: '🏀', role: '볼', type: 'ball', x: 63, y: 34 }
  ],
  full: [
    { id: 'token-off-pg', label: '1', role: 'PG (포인트 가드)', type: 'offense', x: 30, y: 38 },
    { id: 'token-off-sg', label: '2', role: 'SG (슈팅 가드)', type: 'offense', x: 24, y: 77 },
    { id: 'token-off-sf', label: '3', role: 'SF (스몰 포워드)', type: 'offense', x: 22, y: 12 },
    { id: 'token-off-pf', label: '4', role: 'PF (파워 포워드)', type: 'offense', x: 18, y: 58 },
    { id: 'token-off-c', label: '5', role: 'C (센터)', type: 'offense', x: 18, y: 92 },

    { id: 'token-def-d1', label: '1', role: '수비 1', type: 'defense', x: 26, y: 39 },
    { id: 'token-def-d2', label: '2', role: '수비 2', type: 'defense', x: 24, y: 69 },
    { id: 'token-def-d3', label: '3', role: '수비 3', type: 'defense', x: 14, y: 13 },
    { id: 'token-def-d4', label: '4', role: '수비 4', type: 'defense', x: 16, y: 50 },
    { id: 'token-def-d5', label: '5', role: '수비 5', type: 'defense', x: 16, y: 85 },

    { id: 'token-ball', label: '🏀', role: '볼', type: 'ball', x: 32, y: 34 }
  ]
};
