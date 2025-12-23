import { createRoute } from '@granite-js/react-native';
import { Service } from '@shared/api/types';
import { useServices } from '@shared/hooks';
import { SectionCard } from '@shared/ui';
import { useReservationStore } from '@widgets/reservation';

import { ServiceList } from './ServiceList';
import { ServiceListSkeleton } from './ServiceListSkeleton';

// 네비게이션 훅 사용을 위한 임시 라우트
const TempRoute = createRoute('/_layout' as any, { component: () => null });

/**
 * 홈페이지 서비스 섹션
 * 짐싸 스타일의 서비스 리스트
 */
export const HomeServicesSection = () => {
  const navigation = TempRoute.useNavigation();
  const updateFormData = useReservationStore(['updateFormData']).updateFormData;

  const { data: services, isLoading } = useServices();
  const isEmpty = !services || services.length === 0;

  const handleQuotePress = (service: Service) => {
    // 클릭한 서비스를 미리 선택
    updateFormData({ service });

    // 예약 페이지로 이동
    navigation.navigate('/reservation' as any);
  };

  return (
    <SectionCard title="한 번에 인테리어 준비 끝내기">
      <SectionCard.Loading isLoading={isLoading}>
        <ServiceListSkeleton count={2} />
      </SectionCard.Loading>

      <SectionCard.Empty isEmpty={isEmpty} message="등록된 서비스가 없습니다." />

      <SectionCard.Content>{services && <ServiceList services={services} onQuotePress={handleQuotePress} />}</SectionCard.Content>
    </SectionCard>
  );
};
