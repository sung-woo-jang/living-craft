export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  iconUrl?: string;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: '1',
    title: '친구 초대하고 함께 쿠폰 받기',
    subtitle: '시공하는 친구 초대하고 할인 쿠폰 받기!',
    iconUrl: 'https://picsum.photos/seed/coupon/100/100',
  },
  {
    id: '2',
    title: '첫 시공 10% 할인',
    subtitle: '신규 고객 첫 시공 특별 할인!',
    iconUrl: 'https://picsum.photos/seed/discount/100/100',
  },
];
