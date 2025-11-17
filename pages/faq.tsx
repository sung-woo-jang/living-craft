import { createRoute } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Accordion } from '@shared/ui/accordion';

export const Route = createRoute('/faq', {
  component: Page,
});

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: '예약',
    question: '예약은 어떻게 하나요?',
    answer: '서비스 페이지에서 원하시는 서비스를 선택한 후, 예약하기 버튼을 클릭하여 날짜와 시간을 선택하시면 됩니다. 예약 확정 후 이메일로 예약 확인서가 발송됩니다.',
  },
  {
    id: '2',
    category: '예약',
    question: '예약 취소는 어떻게 하나요?',
    answer: '마이페이지 > 내 예약에서 취소하실 예약을 선택하신 후 취소 버튼을 클릭하시면 됩니다. 예약일 기준 24시간 전까지는 무료 취소가 가능합니다.',
  },
  {
    id: '3',
    category: '서비스',
    question: '정찰제와 견적제의 차이는 무엇인가요?',
    answer: '정찰제는 미리 정해진 가격으로 제공되는 서비스이며, 견적제는 현장 상황에 따라 맞춤 견적을 제공하는 서비스입니다. 정찰제는 즉시 예약 확정이 가능하며, 견적제는 상담 후 견적 확정 절차가 필요합니다.',
  },
  {
    id: '4',
    category: '서비스',
    question: '서비스 지역은 어디까지 가능한가요?',
    answer: '현재 서울/경기 지역을 중심으로 서비스를 제공하고 있습니다. 그 외 지역은 별도 문의 주시면 가능 여부를 안내해 드립니다.',
  },
  {
    id: '5',
    category: '결제',
    question: '어떤 결제 수단을 사용할 수 있나요?',
    answer: '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등)를 지원합니다. 법인 고객의 경우 세금계산서 발행도 가능합니다.',
  },
  {
    id: '6',
    category: '결제',
    question: '환불은 어떻게 진행되나요?',
    answer: '취소 접수 후 영업일 기준 3-5일 이내에 결제하신 수단으로 환불됩니다. 부분 취소나 변경 시에는 차액만 환불됩니다.',
  },
  {
    id: '7',
    category: '기타',
    question: 'A/S 보증 기간은 얼마나 되나요?',
    answer: '서비스 완료 후 30일간 무상 A/S를 제공합니다. 시공 하자나 제품 불량의 경우 무상으로 재작업을 진행해 드립니다.',
  },
  {
    id: '8',
    category: '기타',
    question: '견적 상담은 무료인가요?',
    answer: '네, 견적 상담은 무료로 제공됩니다. 현장 방문 상담도 무료이며, 상담 후 계약하지 않으셔도 비용이 발생하지 않습니다.',
  },
];

/**
 * FAQ 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/faq - FAQ 목록 조회
 */
function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>자주 묻는 질문</Text>
        <Text style={styles.subtitle}>고객님들이 자주 묻는 질문을 모았습니다</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {FAQ_DATA.map((faq) => (
          <Accordion key={faq.id} title={faq.question} content={faq.answer} />
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>찾으시는 답변이 없으신가요?</Text>
          <Text style={styles.contactDescription}>
            고객센터로 문의 주시면 빠르게 답변 드리겠습니다.
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📞 02-1234-5678</Text>
            <Text style={styles.contactItem}>✉️ contact@livingcraft.com</Text>
            <Text style={styles.contactItem}>⏰ 평일 09:00 - 18:00</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey50,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey600,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contactSection: {
    backgroundColor: colors.blue50,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.grey700,
    marginBottom: 16,
    lineHeight: 20,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    fontSize: 14,
    color: colors.grey800,
    lineHeight: 22,
  },
});
