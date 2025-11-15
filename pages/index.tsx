import { createRoute } from '@granite-js/react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const navigationItems = [
    {
      category: '메인 & 서비스',
      items: [
        { label: '서비스 목록', path: '/services' },
        { label: '서비스 상세', path: '/services/:id', params: { id: 'a' } },
        { label: '포트폴리오', path: '/portfolio' },
        { label: 'FAQ', path: '/faq' },
      ],
    },
    {
      category: '리뷰',
      items: [
        { label: '리뷰 목록', path: '/reviews' },
        { label: '리뷰 작성', path: '/reviews/write/:reservationId', params: { reservationId: '1' } },
      ],
    },
    {
      category: '예약',
      items: [
        { label: '예약하기', path: '/reservation' },
        { label: '예약 조회', path: '/reservation/search' },
      ],
    },
    {
      category: '견적',
      items: [
        { label: '견적 작성', path: '/quote/builder' },
        { label: '견적 보기', path: '/quote/:id', params: { id: '1' } },
      ],
    },
    {
      category: '마이페이지',
      items: [
        { label: '마이페이지', path: '/my' },
        { label: '내 예약', path: '/my/reservations' },
        { label: '내 리뷰', path: '/my/reviews' },
        { label: '설정', path: '/my/settings' },
      ],
    },
    {
      category: '기타',
      items: [
        { label: 'About', path: '/about' },
        { label: '권한 없음', path: '/unauthorized' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>라우팅 테스트</Text>
        <Text style={styles.subtitle}>아래 버튼을 클릭하여 페이지를 이동하세요</Text>

        {navigationItems.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.path}
                style={styles.button}
                onPress={() => {
                  if (item.params) {
                    navigation.navigate(item.path as any, item.params);
                  } else {
                    navigation.navigate(item.path as any);
                  }
                }}
              >
                <Text style={styles.buttonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0064FF',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  button: {
    backgroundColor: '#0064FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
