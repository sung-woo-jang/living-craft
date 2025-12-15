import { API_BASE_URL } from '@env';

import { AddressSearchResult } from '../types';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

interface AddressSearchData {
  addresses: AddressSearchResult[];
  count: number;
}

/**
 * 백엔드 API를 통해 주소를 검색합니다.
 * 부분 주소 검색이 가능합니다.
 * @param query 검색어 (예: "컨벤시아대로")
 * @param regionPrefix 지역 접두어 (예: "인천 연수구")
 */
export async function searchAddress(
  query: string,
  regionPrefix: string = '인천',
): Promise<AddressSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: query.trim(),
      regionPrefix: regionPrefix.trim(),
    });

    const response = await fetch(`${API_BASE_URL}/address/search?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`주소 검색 API 오류: ${response.status}`);
    }

    const result: SuccessResponse<AddressSearchData> = await response.json();
    return result.data.addresses;
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return [];
  }
}
