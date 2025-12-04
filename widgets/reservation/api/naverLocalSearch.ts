import { AddressSearchResult, NaverLocalSearchItem } from '../types';

const NAVER_CLIENT_ID = 'TlVTw_nfik1JB5syT8b2';
const NAVER_CLIENT_SECRET = 'mVN0TjH7lD';
const NAVER_LOCAL_SEARCH_URL = 'https://openapi.naver.com/v1/search/local.json';

interface NaverLocalSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverLocalSearchItem[];
}

/**
 * 네이버 지역 검색 API를 호출합니다.
 * 인천 지역만 검색되도록 필터링합니다.
 */
export async function searchAddress(query: string): Promise<AddressSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  // 인천 지역으로 검색 범위 제한
  const searchQuery = `인천 ${query}`;

  try {
    const params = new URLSearchParams({
      query: searchQuery,
      display: '5',
      start: '1',
      sort: 'random',
    });

    const response = await fetch(`${NAVER_LOCAL_SEARCH_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`네이버 API 오류: ${response.status}`);
    }

    const data: NaverLocalSearchResponse = await response.json();

    // 인천 지역만 필터링 및 변환
    return data.items
      .filter((item) => {
        const address = item.roadAddress || item.address;
        return address.includes('인천');
      })
      .map((item) => ({
        roadAddress: item.roadAddress || item.address,
        jibunAddress: item.address,
        zipCode: '', // 네이버 API는 우편번호를 제공하지 않음
      }));
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return [];
  }
}
