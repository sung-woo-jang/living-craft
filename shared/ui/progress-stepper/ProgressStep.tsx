import type { ReactNode } from 'react';

export interface ProgressStepProps {
  /**
   * 스텝 제목
   */
  title: string;

  /**
   * 스텝 아이콘 (icon variant에서 사용)
   * @future icon variant 구현 시 사용
   */
  icon?: ReactNode;
}

/**
 * ProgressStepper의 개별 스텝 컴포넌트
 * ProgressStepper의 children으로만 사용됩니다.
 */
export const ProgressStep = (_props: ProgressStepProps) => {
  // 이 컴포넌트는 실제로 렌더링되지 않고,
  // ProgressStepper가 children의 props를 읽어서 사용합니다.
  return null;
};
