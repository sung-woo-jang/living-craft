import { colors } from '@toss/tds-colors';
import { StepKey } from '@types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReservationActionsProps {
  currentStep: StepKey;
  canProceed: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export function ReservationActions({ currentStep, canProceed, onNext, onPrevious, onSubmit }: ReservationActionsProps) {
  const isFirstStep = currentStep === 'service';
  const isLastStep = currentStep === 'confirmation';

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary, isFirstStep && styles.buttonDisabled]}
        onPress={onPrevious}
        disabled={isFirstStep}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>이전</Text>
      </TouchableOpacity>

      {isLastStep ? (
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, !canProceed && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!canProceed}
        >
          <Text style={styles.buttonText}>예약 완료</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, !canProceed && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!canProceed}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey200,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blue500,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey300,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.grey700,
  },
});
