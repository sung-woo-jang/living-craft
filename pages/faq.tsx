import { createRoute } from '@granite-js/react-native';
import { FAQ_DATA } from '@shared/constants';
import { Accordion } from '@shared/ui/accordion';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const Route = createRoute('/faq', {
  component: Page,
});

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
          <Text style={styles.contactDescription}>고객센터로 문의 주시면 빠르게 답변 드리겠습니다.</Text>
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
    backgroundColor: colors.background,
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
