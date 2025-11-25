// FAQ 관련 Mock 데이터
// pages/faq.tsx에서 사용

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: '예약',
    question: '예약은 어떻게 하나요?',
    answer:
      '서비스 페이지에서 원하시는 서비스를 선택한 후, 예약하기 버튼을 클릭하여 날짜와 시간을 선택하시면 됩니다. 예약 확정 후 이메일로 예약 확인서가 발송됩니다.',
  },
  {
    id: '2',
    category: '예약',
    question: '예약 취소는 어떻게 하나요?',
    answer:
      '마이페이지 > 내 예약에서 취소하실 예약을 선택하신 후 취소 버튼을 클릭하시면 됩니다. 예약일 기준 24시간 전까지는 무료 취소가 가능합니다.',
  },
  {
    id: '4',
    category: '서비스',
    question: '서비스 지역은 어디까지 가능한가요?',
    answer:
      '현재 서울/경기 지역을 중심으로 서비스를 제공하고 있습니다. 그 외 지역은 별도 문의 주시면 가능 여부를 안내해 드립니다.',
  },
  {
    id: '5',
    category: '결제',
    question: '어떤 결제 수단을 사용할 수 있나요?',
    answer:
      '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등)를 지원합니다. 법인 고객의 경우 세금계산서 발행도 가능합니다.',
  },
  {
    id: '6',
    category: '결제',
    question: '환불은 어떻게 진행되나요?',
    answer:
      '취소 접수 후 영업일 기준 3-5일 이내에 결제하신 수단으로 환불됩니다. 부분 취소나 변경 시에는 차액만 환불됩니다.',
  },
  {
    id: '7',
    category: '기타',
    question: 'A/S 보증 기간은 얼마나 되나요?',
    answer:
      '서비스 완료 후 30일간 무상 A/S를 제공합니다. 시공 하자나 제품 불량의 경우 무상으로 재작업을 진행해 드립니다.',
  },
];
