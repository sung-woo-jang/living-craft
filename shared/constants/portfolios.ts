import { Portfolio } from '@shared/ui/portfolio-card';

// 포트폴리오 상세 정보 인터페이스
export interface PortfolioDetail extends Portfolio {
  detailedDescription: string;
  tags: string[];
}

// Unsplash 인테리어 이미지 URL 생성 헬퍼
const getUnsplashUrl = (id: number, width = 800, height = 600) =>
  `https://picsum.photos/seed/${id}/${width}/${height}`;

// 각 포트폴리오에 이미지 할당
export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 1,
    projectName: '강남 아파트 전체 리모델링',
    client: '김○○',
    duration: '2024.10 - 2024.12',
    category: '주거공간',
    thumbnail: getUnsplashUrl(1001),
    description: '30평대 아파트 전체 리모델링. 모던하고 깔끔한 공간으로 재탄생',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(1001 + i + 1)),
  },
  {
    id: 2,
    projectName: '카페 인테리어 프로젝트',
    client: '○○카페',
    duration: '2024.09 - 2024.10',
    category: '상업공간',
    thumbnail: getUnsplashUrl(2001),
    description: '빈티지 감성의 카페 인테리어. 따뜻하고 아늑한 분위기 연출',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(2001 + i + 1)),
  },
  {
    id: 3,
    projectName: '사무실 리노베이션',
    client: '○○기업',
    duration: '2024.08 - 2024.09',
    category: '상업공간',
    thumbnail: getUnsplashUrl(3001),
    description: '20평 규모 사무실 공간. 효율적이고 쾌적한 업무 환경 구축',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(3001 + i + 1)),
  },
  {
    id: 4,
    projectName: '북유럽 스타일 주택',
    client: '이○○',
    duration: '2024.07 - 2024.09',
    category: '주거공간',
    thumbnail: getUnsplashUrl(4001),
    description: '단독주택 전체 인테리어. 밝고 따뜻한 북유럽 스타일 적용',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(4001 + i + 1)),
  },
  {
    id: 5,
    projectName: '맞춤 가구 제작 프로젝트',
    client: '박○○',
    duration: '2024.06 - 2024.07',
    category: '가구제작',
    thumbnail: getUnsplashUrl(5001),
    description: '거실 전체를 활용한 맞춤 수납장. 공간 효율 극대화',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(5001 + i + 1)),
  },
  {
    id: 6,
    projectName: '빌라 전체 리노베이션',
    client: '최○○',
    duration: '2024.04 - 2024.06',
    category: '리모델링',
    thumbnail: getUnsplashUrl(6001),
    description: '30년 된 빌라의 완전한 변신. 구조 변경부터 마감까지',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(6001 + i + 1)),
  },
  {
    id: 7,
    projectName: '펜트하우스 인테리어',
    client: '정○○',
    duration: '2024.03 - 2024.05',
    category: '주거공간',
    thumbnail: getUnsplashUrl(7001),
    description: '고급스러운 펜트하우스 인테리어. 럭셔리 모던 스타일',
    images: Array.from({ length: 29 }, (_, i) => getUnsplashUrl(7001 + i + 1)),
  },
  {
    id: 8,
    projectName: '레스토랑 디자인',
    client: '○○레스토랑',
    duration: '2024.01 - 2024.03',
    category: '상업공간',
    thumbnail: getUnsplashUrl(8001),
    description: '30석 규모 레스토랑. 우아하고 세련된 분위기의 다이닝 공간',
    images: Array.from({ length: 28 }, (_, i) => getUnsplashUrl(8001 + i + 1)),
  },
];

// 인테리어 필름 시공 포트폴리오
export const FILM_PORTFOLIOS: Portfolio[] = [
  {
    id: 101,
    projectName: '아파트 주방 리뉴얼',
    client: '김○○',
    duration: '2024.11',
    category: '인테리어필름',
    thumbnail: getUnsplashUrl(9001),
    description: '싱크대와 주방 가구 필름 시공',
    images: Array.from({ length: 10 }, (_, i) => getUnsplashUrl(9001 + i + 1)),
  },
  {
    id: 102,
    projectName: '거실 가구 필름 시공',
    client: '이○○',
    duration: '2024.11',
    category: '인테리어필름',
    thumbnail: getUnsplashUrl(9101),
    description: '원목 패턴 필름으로 따뜻한 분위기 연출',
    images: Array.from({ length: 10 }, (_, i) => getUnsplashUrl(9101 + i + 1)),
  },
  {
    id: 103,
    projectName: '문틀 대리석 필름',
    client: '박○○',
    duration: '2024.10',
    category: '인테리어필름',
    thumbnail: getUnsplashUrl(9201),
    description: '대리석 패턴으로 고급스러운 분위기',
    images: Array.from({ length: 10 }, (_, i) => getUnsplashUrl(9201 + i + 1)),
  },
  {
    id: 104,
    projectName: '욕실 타일 필름',
    client: '최○○',
    duration: '2024.10',
    category: '인테리어필름',
    thumbnail: getUnsplashUrl(9301),
    description: '방수 필름으로 깨끗한 욕실 완성',
    images: Array.from({ length: 10 }, (_, i) => getUnsplashUrl(9301 + i + 1)),
  },
];

// 포트폴리오 상세 정보 (ID 기반 Record)
export const PORTFOLIO_DETAILS: Record<string, PortfolioDetail> = {
  '1': {
    ...MOCK_PORTFOLIOS[0]!,
    detailedDescription: `30평대 아파트 전체 공간을 모던하고 실용적인 공간으로 새롭게 디자인했습니다.

• 공간 재구성: 폐쇄적인 구조를 개방형으로 변경하여 넓고 쾌적한 공간 확보
• 맞춤 수납: 공간 활용을 극대화한 맞춤형 붙박이장 설치
• 컬러 컨셉: 화이트와 그레이 톤의 모던한 컬러 적용
• 조명 설계: LED 간접조명으로 따뜻하고 세련된 분위기 연출
• 자재 선택: 고급 자재와 친환경 마감재 사용

클라이언트의 라이프스타일을 고려한 실용적이면서도 미적인 공간을 완성했습니다.`,
    tags: ['리모델링', '아파트', '모던', '전체공사'],
  },
  '2': {
    ...MOCK_PORTFOLIOS[1]!,
    detailedDescription: `20평 규모의 카페를 빈티지 감성으로 디자인했습니다.

• 컨셉: 따뜻하고 아늑한 브루클린 스타일 카페
• 자재: 원목, 벽돌, 철제 등 빈티지 감성의 자재 활용
• 조명: 펜던트 조명과 에디슨 전구로 분위기 연출
• 가구: 빈티지 테이블과 의자로 독특한 개성 표현
• 플랜트: 그린 인테리어로 생동감 있는 공간 완성

방문객들이 편안하게 머물 수 있는 감성적인 공간을 만들었습니다.`,
    tags: ['카페', '빈티지', '상업공간', '인테리어'],
  },
  '3': {
    ...MOCK_PORTFOLIOS[2]!,
    detailedDescription: `스타트업 기업의 사무실을 효율적이고 창의적인 공간으로 재구성했습니다.

• 오픈 레이아웃: 협업이 용이한 개방형 구조
• 회의실: 유리 파티션으로 개방감을 유지하면서 독립적인 공간 확보
• 휴게 공간: 직원들의 재충전을 위한 편안한 휴식 공간
• 컬러: 화이트와 우드 톤의 깔끔하고 밝은 분위기
• 수납: 효율적인 수납 시스템으로 정돈된 사무 환경

직원들의 업무 효율과 만족도를 높이는 공간을 만들었습니다.`,
    tags: ['사무실', '리노베이션', '상업공간', '오픈오피스'],
  },
  '4': {
    ...MOCK_PORTFOLIOS[3]!,
    detailedDescription: `단독주택을 북유럽 스타일의 따뜻하고 밝은 공간으로 디자인했습니다.

• 스타일: 심플하면서도 기능적인 스칸디나비안 디자인
• 컬러: 화이트를 베이스로 자연스러운 우드 톤 적용
• 가구: 북유럽 브랜드 가구와 국산 맞춤 가구의 조화
• 조명: 자연광을 최대한 활용하고 따뜻한 간접조명 배치
• 소품: 미니멀한 소품으로 포인트 연출

가족 모두가 편안하게 생활할 수 있는 따뜻한 집을 완성했습니다.`,
    tags: ['주택', '북유럽', '단독주택', '전체공사'],
  },
  '5': {
    ...MOCK_PORTFOLIOS[4]!,
    detailedDescription: `거실 전체를 활용한 맞춤 수납장 프로젝트입니다.

• 공간 분석: 거실 구조와 동선을 고려한 맞춤 설계
• 수납 최적화: 다양한 물건을 효율적으로 수납할 수 있는 구조
• 디자인: 인테리어와 조화를 이루는 세련된 디자인
• 자재: 고품질 원목과 친환경 도료 사용
• 기능성: 숨김 수납과 오픈 수납의 적절한 배치

공간 효율을 극대화하면서도 아름다운 가구를 만들었습니다.`,
    tags: ['가구제작', '맞춤수납', '거실', '원목가구'],
  },
  '6': {
    ...MOCK_PORTFOLIOS[5]!,
    detailedDescription: `30년 된 빌라의 완전한 변신 프로젝트입니다.

• 구조 변경: 낡은 구조를 현대적으로 개선
• 설비 교체: 전기, 배관 등 노후 설비 전면 교체
• 단열 보강: 에너지 효율을 높이는 단열 시스템 적용
• 마감재: 트렌디하고 내구성 좋은 마감재 선택
• 공간 활용: 데드 스페이스를 최소화한 효율적인 설계

오래된 공간을 새집처럼 깔끔하게 재탄생시켰습니다.`,
    tags: ['빌라', '리모델링', '전체공사', '구조변경'],
  },
  '7': {
    ...MOCK_PORTFOLIOS[6]!,
    detailedDescription: `고급스러운 펜트하우스 인테리어 프로젝트입니다.

• 스타일: 럭셔리 모던 스타일의 세련된 디자인
• 공간감: 높은 천장을 살린 개방적인 공간 연출
• 자재: 대리석, 고급 원목 등 프리미엄 자재 사용
• 조명: 샹들리에와 간접조명의 조화로운 배치
• 가구: 명품 가구와 맞춤 가구의 완벽한 조합

품격 있고 세련된 주거 공간을 완성했습니다.`,
    tags: ['펜트하우스', '럭셔리', '모던', '고급주택'],
  },
  '8': {
    ...MOCK_PORTFOLIOS[7]!,
    detailedDescription: `30석 규모 레스토랑의 우아한 다이닝 공간입니다.

• 컨셉: 고급스럽고 세련된 파인 다이닝 레스토랑
• 좌석 배치: 프라이빗한 식사가 가능한 테이블 배치
• 조명: 은은하고 따뜻한 조명으로 분위기 연출
• 자재: 고급 원목과 패브릭으로 우아함 강조
• 컬러: 다크 톤과 골드 포인트로 품격 표현

손님들에게 특별한 다이닝 경험을 선사하는 공간을 만들었습니다.`,
    tags: ['레스토랑', '상업공간', '파인다이닝', '인테리어'],
  },
};
