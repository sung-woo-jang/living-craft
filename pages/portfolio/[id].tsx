import { createRoute, useNavigation } from '@granite-js/react-native';
import { colors } from '@toss/tds-colors';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/portfolio/:id', {
  validateParams: (params) => params as { id: string },
  component: Page,
});

interface PortfolioDetail {
  id: number;
  projectName: string;
  client: string;
  duration: string;
  category: string;
  description: string;
  detailedDescription: string;
  beforeAfterImages?: {
    before: string;
    after: string;
  };
  images: string[];
  tags: string[];
}

// Mock 데이터 (실제로는 API에서 가져와야 함)
const MOCK_PORTFOLIO_DETAILS: Record<string, PortfolioDetail> = {
  '1': {
    id: 1,
    projectName: '강남 아파트 전체 리모델링',
    client: '김○○',
    duration: '2024.10 - 2024.12',
    category: '주거공간',
    description: '30평대 아파트 전체 리모델링. 모던하고 깔끔한 공간으로 재탄생',
    detailedDescription: `30평대 아파트 전체 공간을 모던하고 실용적인 공간으로 새롭게 디자인했습니다.

• 공간 재구성: 폐쇄적인 구조를 개방형으로 변경하여 넓고 쾌적한 공간 확보
• 맞춤 수납: 공간 활용을 극대화한 맞춤형 붙박이장 설치
• 컬러 컨셉: 화이트와 그레이 톤의 모던한 컬러 적용
• 조명 설계: LED 간접조명으로 따뜻하고 세련된 분위기 연출
• 자재 선택: 고급 자재와 친환경 마감재 사용

클라이언트의 라이프스타일을 고려한 실용적이면서도 미적인 공간을 완성했습니다.`,
    beforeAfterImages: {
      before: 'https://via.placeholder.com/400x300/95a5a6/ffffff?text=Before',
      after: 'https://via.placeholder.com/400x300/3498db/ffffff?text=After',
    },
    images: [
      'https://via.placeholder.com/400x300/3498db/ffffff?text=Living',
      'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Kitchen',
      'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Bedroom',
      'https://via.placeholder.com/400x300/f39c12/ffffff?text=Bathroom',
    ],
    tags: ['리모델링', '아파트', '모던', '전체공사'],
  },
  '2': {
    id: 2,
    projectName: '카페 인테리어 프로젝트',
    client: '○○카페',
    duration: '2024.09 - 2024.10',
    category: '상업공간',
    description: '빈티지 감성의 카페 인테리어. 따뜻하고 아늑한 분위기 연출',
    detailedDescription: `20평 규모의 카페를 빈티지 감성으로 디자인했습니다.

• 컨셉: 따뜻하고 아늑한 브루클린 스타일 카페
• 자재: 원목, 벽돌, 철제 등 빈티지 감성의 자재 활용
• 조명: 펜던트 조명과 에디슨 전구로 분위기 연출
• 가구: 빈티지 테이블과 의자로 독특한 개성 표현
• 플랜트: 그린 인테리어로 생동감 있는 공간 완성

방문객들이 편안하게 머물 수 있는 감성적인 공간을 만들었습니다.`,
    images: [
      'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Interior1',
      'https://via.placeholder.com/400x300/27ae60/ffffff?text=Interior2',
      'https://via.placeholder.com/400x300/16a085/ffffff?text=Interior3',
    ],
    tags: ['카페', '빈티지', '상업공간', '인테리어'],
  },
  '3': {
    id: 3,
    projectName: '사무실 리노베이션',
    client: '○○기업',
    duration: '2024.08 - 2024.09',
    category: '상업공간',
    description: '20평 규모 사무실 공간. 효율적이고 쾌적한 업무 환경 구축',
    detailedDescription: `스타트업 기업의 사무실을 효율적이고 창의적인 공간으로 재구성했습니다.

• 오픈 레이아웃: 협업이 용이한 개방형 구조
• 회의실: 유리 파티션으로 개방감을 유지하면서 독립적인 공간 확보
• 휴게 공간: 직원들의 재충전을 위한 편안한 휴식 공간
• 컬러: 화이트와 우드 톤의 깔끔하고 밝은 분위기
• 수납: 효율적인 수납 시스템으로 정돈된 사무 환경

직원들의 업무 효율과 만족도를 높이는 공간을 만들었습니다.`,
    beforeAfterImages: {
      before: 'https://via.placeholder.com/400x300/7f8c8d/ffffff?text=Office-Before',
      after: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Office-After',
    },
    images: [
      'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Workspace',
      'https://via.placeholder.com/400x300/c0392b/ffffff?text=Meeting',
    ],
    tags: ['사무실', '리노베이션', '상업공간', '오픈오피스'],
  },
  '4': {
    id: 4,
    projectName: '북유럽 스타일 주택',
    client: '이○○',
    duration: '2024.07 - 2024.09',
    category: '주거공간',
    description: '단독주택 전체 인테리어. 밝고 따뜻한 북유럽 스타일 적용',
    detailedDescription: `단독주택을 북유럽 스타일의 따뜻하고 밝은 공간으로 디자인했습니다.

• 스타일: 심플하면서도 기능적인 스칸디나비안 디자인
• 컬러: 화이트를 베이스로 자연스러운 우드 톤 적용
• 가구: 북유럽 브랜드 가구와 국산 맞춤 가구의 조화
• 조명: 자연광을 최대한 활용하고 따뜻한 간접조명 배치
• 소품: 미니멀한 소품으로 포인트 연출

가족 모두가 편안하게 생활할 수 있는 따뜻한 집을 완성했습니다.`,
    images: [
      'https://via.placeholder.com/400x300/f39c12/ffffff?text=Living',
      'https://via.placeholder.com/400x300/d68910/ffffff?text=Dining',
      'https://via.placeholder.com/400x300/f1c40f/ffffff?text=Bedroom',
    ],
    tags: ['주택', '북유럽', '단독주택', '전체공사'],
  },
};

/**
 * 포트폴리오 상세 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/portfolios/{id} - 포트폴리오 상세 정보 조회
 */
function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();

  const portfolio = MOCK_PORTFOLIO_DETAILS[params?.id || '1'];

  if (!portfolio) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>포트폴리오를 찾을 수 없습니다.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 헤더 */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{portfolio.category}</Text>
          </View>
          <Text style={styles.projectName}>{portfolio.projectName}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>클라이언트</Text>
              <Text style={styles.metaValue}>{portfolio.client}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>작업기간</Text>
              <Text style={styles.metaValue}>{portfolio.duration}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* 프로젝트 설명 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>프로젝트 소개</Text>
            <Text style={styles.description}>{portfolio.detailedDescription}</Text>
          </View>

          {/* 비포/애프터 섹션 (있을 경우만 표시) */}
          {portfolio.beforeAfterImages && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Before & After</Text>
              <View style={styles.beforeAfterContainer}>
                <View style={styles.beforeAfterItem}>
                  <Text style={styles.beforeAfterLabel}>Before</Text>
                  <Image source={{ uri: portfolio.beforeAfterImages.before }} style={styles.beforeAfterImage} />
                </View>
                <View style={styles.beforeAfterItem}>
                  <Text style={styles.beforeAfterLabel}>After</Text>
                  <Image source={{ uri: portfolio.beforeAfterImages.after }} style={styles.beforeAfterImage} />
                </View>
              </View>
            </View>
          )}

          {/* 작업 이미지 갤러리 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>작업 이미지</Text>
            <View style={styles.imageGallery}>
              {portfolio.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </View>
          </View>

          {/* 태그 */}
          <View style={styles.section}>
            <View style={styles.tagsContainer}>
              {portfolio.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 플로팅 탭바를 위한 하단 여백
  },
  header: {
    padding: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.grey600,
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
  },
  divider: {
    width: 1,
    backgroundColor: colors.grey200,
    marginHorizontal: 16,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 24,
  },
  beforeAfterContainer: {
    gap: 16,
  },
  beforeAfterItem: {
    marginBottom: 8,
  },
  beforeAfterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey800,
    marginBottom: 8,
  },
  beforeAfterImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.grey200,
  },
  imageGallery: {
    gap: 16,
  },
  galleryImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: colors.grey200,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.blue100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: colors.blue600,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.grey700,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.blue500,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
