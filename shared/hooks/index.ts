// ===== Utility Hooks =====
export { useBoolean } from './useBoolean';
export { usePermissionGate } from './usePermissionGate';
export type { ImageState } from './usePhotoManager';
export { usePhotoManager } from './usePhotoManager';

// ===== Query Utilities =====
export { useStandardQuery, useStandardMutation } from './custom-query';
export { generateQueryKeysFromUrl } from './query-keys';
export { useRefresh } from './useRefresh';

// ===== API Hooks (re-export from @shared/api for backwards compatibility) =====
// NOTE: 새 코드에서는 @shared/api에서 직접 import하는 것을 권장합니다.
export {
  // Auth
  useLogin,
  useLogout,
  useRefreshToken,
  useIsAuthenticated,
  useCurrentUser,
  // Services
  useServices,
  useAvailableTimes,
  useAvailableDates,
  // Reservations
  useReservation,
  useMyReservations,
  useCreateReservation,
  useCancelReservation,
  // Portfolios
  usePortfolios,
  usePortfolio,
  // Reviews
  useReviews,
  useCreateReview,
  // Promotions
  usePromotions,
  useIncrementPromotionClick,
  // Users
  useMe,
  useMyReviews,
  // Files
  useUploadReviewImages,
  useUploadReservationImages,
} from '../api';
