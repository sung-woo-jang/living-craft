import { colors } from '@toss/tds-colors';
import { StyleSheet, Text, View } from 'react-native';

export interface Step {
  key: string;
  title: string;
  number: number;
}

type StepStatus = 'pending' | 'active' | 'completed';

interface StepIndicatorProps {
  steps: Step[];
  currentStepKey: string;
}

/**
 * 스텝 인디케이터 컴포넌트
 * 멀티 스텝 프로세스의 진행 상황을 표시
 */
export const StepIndicator = ({ steps, currentStepKey }: StepIndicatorProps) => {
  const getStepStatus = (stepKey: string): StepStatus => {
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    const currentIndex = steps.findIndex((s) => s.key === currentStepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.key);
        const isLast = index === steps.length - 1;

        return (
          <View key={step.key} style={styles.stepWrapper}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  status === 'active' && styles.stepCircleActive,
                  status === 'completed' && styles.stepCircleCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    status === 'active' && styles.stepNumberActive,
                    status === 'completed' && styles.stepNumberCompleted,
                  ]}
                >
                  {status === 'completed' ? '✓' : step.number}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepTitle,
                  status === 'active' && styles.stepTitleActive,
                  status === 'completed' && styles.stepTitleCompleted,
                ]}
              >
                {step.title}
              </Text>
            </View>
            {!isLast && <View style={styles.stepConnector} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.blue500,
  },
  stepCircleCompleted: {
    backgroundColor: colors.green500,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey600,
  },
  stepNumberActive: {
    color: 'white',
  },
  stepNumberCompleted: {
    color: 'white',
  },
  stepTitle: {
    fontSize: 11,
    color: colors.grey600,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: colors.blue500,
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: colors.green500,
    fontWeight: '600',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.grey200,
    marginHorizontal: 4,
  },
});
