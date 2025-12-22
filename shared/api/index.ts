/**
 * API 모듈 통합 export
 */

// ===== Core =====
export { axiosInstance, formInstance, ContentType } from './axios';
export type { TypedAxiosInstance } from './axios-types';
export type {
  ApiResponse,
  ErrorResponse,
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
  BackendPaginationParams,
} from './apiResponseTypes';
export { convertPageToOffset } from './apiResponseTypes';
export { AUTH_API, API } from './endpoints';

// ===== Domain Types =====
export type * from './types';

// ===== Domain APIs =====
// Auth
export {
  useLogin,
  useLogout,
  useRefreshToken,
  useIsAuthenticated,
  useCurrentUser,
} from './auth';

// Services
export { getServices, useServices, useAvailableTimes, useAvailableDates } from './services';

// Reservations
export {
  useReservation,
  useMyReservations,
  useCreateReservation,
  useCancelReservation,
} from './reservations';

// Portfolios
export { usePortfolios, usePortfolio } from './portfolios';

// Reviews
export { useReviews, useCreateReview } from './reviews';

// Promotions
export { usePromotions, useIncrementPromotionClick } from './promotions';

// Users
export { useMe, useMyReviews } from './users';

// Files
export { useUploadReviewImages, useUploadReservationImages } from './files';
