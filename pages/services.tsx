import { createRoute } from '@granite-js/react-native';
import { EmptyState } from '@shared/ui/empty-state';
import { Service, ServiceCard } from '@shared/ui/service-card';
import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export const Route = createRoute('/services', {
  component: Page,
});

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: '홈 스타일링',
    description: '전문 디자이너가 제안하는 맞춤형 인테리어',
    price: '₩150,000',
    type: 'fixed',
    duration: '3-4시간',
    features: ['현장 방문', '디자인 제안', '가구 배치'],
    image: null,
  },
  {
    id: 2,
    title: '가구 제작',
    description: '공간에 딱 맞는 맞춤 가구 제작',
    price: '견적 후 결정',
    type: 'quote',
    duration: '상담 필요',
    features: ['맞춤 설계', '고급 자재', '설치 포함'],
    image: null,
  },
  {
    id: 3,
    title: '리모델링',
    description: '오래된 공간을 새롭게 변신',
    price: '견적 후 결정',
    type: 'quote',
    duration: '1-2주',
    features: ['전체 공사', '인테리어', 'A/S 보증'],
    image: null,
  },
  {
    id: 4,
    title: '컨설팅',
    description: '전문가의 1:1 공간 컨설팅',
    price: '₩80,000',
    type: 'fixed',
    duration: '1-2시간',
    features: ['현장 방문', '상세 보고서', '추천 자재'],
    image: null,
  },
  {
    id: 5,
    title: '소품 코디네이션',
    description: '공간을 완성하는 소품 선택과 배치',
    price: '₩100,000',
    type: 'fixed',
    duration: '2-3시간',
    features: ['소품 선정', '배치 디자인', '구매 대행'],
    image: null,
  },
  {
    id: 6,
    title: '상업 공간 디자인',
    description: '카페, 사무실 등 상업 공간 인테리어',
    price: '견적 후 결정',
    type: 'quote',
    duration: '상담 필요',
    features: ['브랜드 분석', '맞춤 설계', '시공 관리'],
    image: null,
  },
];

/**
 * 서비스 목록 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/services - 서비스 목록 조회
 * 2. GET /api/services/type/{type} - 타입별 필터링
 */
function Page() {
  const navigation = Route.useNavigation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: API 연동 필요
  const filteredServices = MOCK_SERVICES.filter((service) => {
    const matchesFilter = activeFilter === 'all' || service.type === activeFilter;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleReset = () => {
    setActiveFilter('all');
    setSearchQuery('');
  };

  const handleServicePress = (serviceId: number) => {
    navigation.navigate('/services/:id' as any, { id: String(serviceId) });
  };

  const handleBookPress = (serviceId: number) => {
    navigation.navigate('/reservation' as any, { serviceId: String(serviceId) });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>서비스</Text>
        <Text style={styles.subtitle}>리빙크래프트의 다양한 서비스를 만나보세요</Text>
      </View>

      {/* 서비스 목록 */}
      {filteredServices.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없습니다"
          description="다른 검색어를 입력하시거나 필터를 변경해보세요"
          actionLabel="필터 초기화"
          onActionPress={handleReset}
        />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ServiceCard service={item} onPress={handleServicePress} onBookPress={handleBookPress} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  listContent: {
    padding: 20,
  },
});
