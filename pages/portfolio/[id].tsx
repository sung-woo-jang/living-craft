import { createRoute, Image, useNavigation } from '@granite-js/react-native';
import { PORTFOLIO_DETAILS } from '@shared/constants';
import { Carousel } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/portfolio/:id', {
  validateParams: (params) => params as { id: string },
  component: Page,
});

/**
 * 포트폴리오 상세 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/portfolios/{id} - 포트폴리오 상세 정보 조회
 */
function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();

  const portfolio = PORTFOLIO_DETAILS[params?.id || '1'];

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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
        </View>

        {/* 작업 이미지 갤러리 */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle}>작업 이미지</Text>
          <Carousel
            data={portfolio.images.map((image, index) => ({ id: index, url: image }))}
            renderItem={(item) => (
              <Image
                source={{ uri: item.url }}
                style={styles.galleryImage}
                resizeMode="cover"
                onError={() => {
                  console.warn(`Failed to load gallery image: ${item.url}`);
                }}
              />
            )}
            itemHeight={240}
            gap={32}
            autoPlay
            autoPlayInterval={5000}
          />
        </View>

        <View style={styles.content}>
          {/* 태그 */}
          <View style={styles.section}>
            <View style={styles.tagsContainer}>
              {portfolio.tags.map((tag: string, index: number) => (
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
  carouselSection: {
    marginBottom: 32,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 16,
    paddingHorizontal: 20,
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
