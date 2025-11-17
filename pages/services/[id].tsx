import { createRoute, useNavigation } from '@granite-js/react-native';
import type { Service } from '@shared/ui/service-card/ServiceCard';
import { colors } from '@toss/tds-colors';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Route = createRoute('/services/:id', {
  validateParams: (params) => params as { id: string },
  component: Page,
});

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock 데이터 (실제로는 API에서 가져와야 함)
const MOCK_SERVICE_DETAILS: Record<string, Service & { images: string[]; detailedDescription: string; reviews: Review[] }> = {
  '1': {
    id: 1,
    title: '아파트 전체 리모델링',
    description: '30평대 아파트 전체 리모델링 서비스입니다.',
    price: '2,800만원~',
    type: 'quote',
    duration: '3-4주',
    features: ['현장 실측', '맞춤 설계', '철거 및 폐기', '전체 시공', '마감 공사', '청소'],
    image: null,
    images: [
      'https://via.placeholder.com/400x300/3498db/ffffff?text=Image1',
      'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Image2',
      'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Image3',
    ],
    detailedDescription: `전문 인테리어 디자이너와 함께하는 아파트 전체 리모델링 서비스입니다.

• 현장 실측 및 상담: 전문가가 직접 방문하여 정확한 측정과 상담을 진행합니다.
• 맞춤 설계: 고객의 라이프스타일에 맞춘 최적의 공간 설계를 제안합니다.
• 철거 및 폐기: 기존 구조물의 안전한 철거와 폐기물 처리를 진행합니다.
• 전체 시공: 전기, 배관, 목공, 도배, 마루 등 모든 공정을 책임집니다.
• 마감 공사: 꼼꼼한 마무리 작업으로 완성도를 높입니다.
• 청소: 입주 전 깨끗한 청소로 마무리합니다.

※ 정확한 견적은 현장 상담 후 제공됩니다.`,
    reviews: [
      {
        id: '1',
        userName: '김**',
        rating: 5,
        comment: '처음부터 끝까지 정말 만족스러웠습니다. 꼼꼼하고 친절하게 진행해주셔서 감사합니다.',
        date: '2024-12-10',
      },
      {
        id: '2',
        userName: '이**',
        rating: 5,
        comment: '기대 이상이었어요. 디자인 제안도 좋았고 시공 품질도 훌륭했습니다.',
        date: '2024-11-28',
      },
      {
        id: '3',
        userName: '박**',
        rating: 4,
        comment: '전반적으로 만족합니다. A/S도 빠르게 대응해주셨어요.',
        date: '2024-11-15',
      },
    ],
  },
  '2': {
    id: 2,
    title: '주방 리모델링',
    description: '맞춤형 주방 리모델링으로 쾌적한 요리 공간을 만들어드립니다.',
    price: '580만원~',
    type: 'quote',
    duration: '1-2주',
    features: ['주방 철거', '맞춤 싱크대', '상판 교체', '타일 시공', '전기 작업'],
    image: null,
    images: [
      'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Kitchen1',
      'https://via.placeholder.com/400x300/f39c12/ffffff?text=Kitchen2',
    ],
    detailedDescription: `공간에 맞춘 맞춤형 주방 리모델링 서비스입니다.

• 기존 주방 철거 및 폐기물 처리
• 고객 취향에 맞춘 맞춤 싱크대 제작 및 설치
• 다양한 소재의 상판 교체 (인조대리석, 세라믹 등)
• 벽/바닥 타일 시공
• 전기 및 조명 작업

※ 소재와 옵션에 따라 가격이 달라질 수 있습니다.`,
    reviews: [
      {
        id: '1',
        userName: '최**',
        rating: 5,
        comment: '주방이 정말 깔끔하고 예뻐졌어요. 요리하는 게 즐거워졌습니다!',
        date: '2024-12-05',
      },
    ],
  },
};

/**
 * 서비스 상세 페이지
 *
 * 필요한 API 연결:
 * 1. GET /api/services/{id} - 서비스 상세 정보 조회
 * 2. GET /api/services/{id}/reviews - 서비스 리뷰 조회
 */
function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();

  const service = MOCK_SERVICE_DETAILS[params?.id || '1'];

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>서비스를 찾을 수 없습니다.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBooking = () => {
    navigation.navigate('/reservation', { serviceId: service.id });
  };

  const averageRating = service.reviews.length
    ? (service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 이미지 갤러리 */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
          {service.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          {/* 타입 뱃지 */}
          <View style={[styles.typeBadge, service.type === 'quote' && styles.typeBadgeQuote]}>
            <Text style={styles.typeBadgeText}>{service.type === 'fixed' ? '정찰제' : '견적제'}</Text>
          </View>

          {/* 제목 및 가격 */}
          <Text style={styles.title}>{service.title}</Text>
          <Text style={[styles.price, service.type === 'quote' && styles.priceQuote]}>{service.price}</Text>

          {/* 기본 정보 */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>소요 시간</Text>
              <Text style={styles.infoValue}>{service.duration}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>평균 평점</Text>
              <Text style={styles.infoValue}>⭐ {averageRating}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>리뷰</Text>
              <Text style={styles.infoValue}>{service.reviews.length}개</Text>
            </View>
          </View>

          {/* 상세 설명 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>서비스 설명</Text>
            <Text style={styles.description}>{service.detailedDescription}</Text>
          </View>

          {/* 포함 서비스 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>포함 서비스</Text>
            <View style={styles.featuresList}>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 리뷰 섹션 */}
          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>고객 리뷰</Text>
              <TouchableOpacity onPress={() => navigation.navigate('/reviews', { serviceId: service.id })}>
                <Text style={styles.viewAllText}>전체보기</Text>
              </TouchableOpacity>
            </View>
            {service.reviews.length === 0 ? (
              <Text style={styles.noReviews}>아직 리뷰가 없습니다.</Text>
            ) : (
              service.reviews.slice(0, 3).map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Text key={index} style={styles.star}>
                        {index < review.rating ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 예약 버튼 */}
      <View style={styles.footer}>
        <View style={styles.footerPriceContainer}>
          <Text style={styles.footerPriceLabel}>시작 가격</Text>
          <Text style={styles.footerPrice}>{service.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>예약하기</Text>
        </TouchableOpacity>
      </View>
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
  imageGallery: {
    height: 300,
    backgroundColor: colors.grey100,
  },
  image: {
    width: 400,
    height: 300,
    backgroundColor: colors.grey200,
  },
  content: {
    padding: 20,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  typeBadgeQuote: {
    backgroundColor: colors.purple500,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.blue600,
    marginBottom: 20,
  },
  priceQuote: {
    fontSize: 20,
    color: colors.purple600,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: colors.grey50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.grey600,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey900,
  },
  divider: {
    width: 1,
    backgroundColor: colors.grey200,
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 16,
    color: colors.blue500,
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: colors.grey700,
    lineHeight: 22,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.blue500,
    fontWeight: '500',
  },
  noReviews: {
    fontSize: 14,
    color: colors.grey500,
    textAlign: 'center',
    paddingVertical: 20,
  },
  reviewCard: {
    backgroundColor: colors.grey50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey900,
  },
  reviewDate: {
    fontSize: 13,
    color: colors.grey600,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.grey700,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
    gap: 12,
  },
  footerPriceContainer: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: colors.grey600,
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
  },
  bookingButton: {
    flex: 1,
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
