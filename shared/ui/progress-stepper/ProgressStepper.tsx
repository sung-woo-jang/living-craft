import { colors } from '@toss/tds-colors';
import type { ReactElement } from 'react';
import { Children } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ProgressStepProps } from './ProgressStep';

type Variant = 'compact';
type PaddingTop = 'default' | 'wide';

interface ProgressStepperProps {
  /**
   * 표시 스타일
   * @default 'compact'
   */
  variant?: Variant;

  /**
   * 상단 여백 제어
   * - default: 16px
   * - wide: 24px
   * @default 'default'
   */
  paddingTop?: PaddingTop;

  /**
   * 현재 활성화된 스텝의 인덱스 (0부터 시작)
   * @default 0
   */
  activeStepIndex?: number;

  /**
   * 완료된 스텝에 체크 표시를 할지 여부
   * @default false
   */
  checkForFinish?: boolean;

  /**
   * ProgressStep 컴포넌트들
   */
  children: ReactElement<ProgressStepProps> | ReactElement<ProgressStepProps>[];
}

/**
 * Toss ProgressStepper 컴포넌트
 *
 * 단계별 작업 진행 상황을 프로그레스 바와 스텝으로 시각적으로 표시합니다.
 * 사용자가 현재 어느 단계에 있는지, 앞으로 남은 단계는 무엇인지 명확하게 보여줍니다.
 *
 * @see https://tossmini-docs.toss.im/tds-mobile/components/progress-stepper/
 */
export const ProgressStepper = ({
  variant = 'compact',
  paddingTop = 'default',
  activeStepIndex = 0,
  checkForFinish = false,
  children,
}: ProgressStepperProps) => {
  // children에서 ProgressStep의 props 추출
  const steps = Children.toArray(children)
    .filter((child): child is ReactElement<ProgressStepProps> => {
      return typeof child === 'object' && child !== null && 'props' in child;
    })
    .map((child) => child.props);

  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 1 ? (activeStepIndex / (totalSteps - 1)) * 100 : 0;

  // 각 스텝의 상태 결정
  const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
    if (index < activeStepIndex) return 'completed';
    if (index === activeStepIndex) return 'active';
    return 'pending';
  };

  if (variant !== 'compact') {
    // 향후 icon variant 구현 시 분기
    return null;
  }

  return (
    <View style={[styles.container, paddingTop === 'wide' ? styles.paddingTopWide : styles.paddingTopDefault]}>
      {/* 프로그레스 바 */}
      <View style={styles.progressBarContainer}>
        {/* 배경 바 */}
        <View style={styles.progressBarBackground}>
          {/* 진행 바 */}
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>

        {/* 현재 스텝 위치 표시 아이콘 */}
        {totalSteps > 1 && (
          <View
            style={[
              styles.currentStepIndicator,
              {
                left: `${progressPercentage}%`,
              },
            ]}
          >
            <View style={styles.currentStepIndicatorOuter}>
              <View style={styles.currentStepIndicatorInner} />
            </View>
          </View>
        )}
      </View>

      {/* 스텝 타이틀들 */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const showCheckmark = checkForFinish && status === 'completed';
          const isActive = status === 'active';
          const isPending = status === 'pending';

          return (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepTitleWrapper}>
                {/* 완료 체크마크 아이콘 (타이틀 위에 표시) */}
                {showCheckmark && (
                  <View style={styles.completedCheckmarkContainer}>
                    <View style={styles.completedCheckmarkOuter}>
                      <View style={styles.completedCheckmarkInner}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    </View>
                  </View>
                )}

                <Text
                  style={[
                    styles.stepTitle,
                    (status === 'completed' || status === 'active') && styles.stepTitleActive,
                    isPending && styles.stepTitlePending,
                  ]}
                  numberOfLines={1}
                >
                  {step.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  paddingTopDefault: {
    paddingTop: 16,
  },
  paddingTopWide: {
    paddingTop: 24,
  },

  // 프로그레스 바
  progressBarContainer: {
    position: 'relative',
    height: 8,
    marginBottom: 6,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: colors.grey200,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(2, 32, 71, 0.05)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.grey200,
    borderRadius: 40,
  },

  // 현재 스텝 위치 표시 아이콘
  currentStepIndicator: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 8,
    marginLeft: -4, // 중앙 정렬
  },
  currentStepIndicatorOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(49, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
    marginTop: -4,
  },
  currentStepIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue500,
  },

  // 스텝 타이틀
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  stepItem: {
    // flex를 사용하지 않고 자연스러운 크기 유지
  },
  stepTitleWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 13,
    lineHeight: 19.5, // 1.5em
    textAlign: 'center',
  },
  stepTitleActive: {
    fontWeight: '700',
    color: '#333D48',
  },
  stepTitlePending: {
    fontWeight: '600',
    color: '#6B7684',
  },

  // 완료 체크마크 (타이틀 위)
  completedCheckmarkContainer: {
    position: 'absolute',
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckmarkOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(49, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckmarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 6,
    fontWeight: 'bold',
  },
});
