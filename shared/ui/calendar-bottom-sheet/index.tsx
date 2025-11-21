import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CalendarGrid } from './calendar-grid';
import { MonthNavigator } from './month-navigator';
import { formatDateToString, generateCalendarGrid } from './utils';

interface CalendarBottomSheetProps {
  visible: boolean;
  selectedDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  title?: string;
  confirmButtonText?: string;
  onConfirm: (date: Date) => void;
  onClose: () => void;
}

export function CalendarBottomSheet({
  visible,
  selectedDate: initialSelectedDate,
  minDate,
  maxDate,
  disabledDates,
  title = '날짜 선택',
  confirmButtonText = '확인',
  onConfirm,
  onClose,
}: CalendarBottomSheetProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(initialSelectedDate?.getFullYear() ?? today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialSelectedDate?.getMonth() ?? today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate);

  const calendarDays = generateCalendarGrid(currentYear, currentMonth + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dimBackground} activeOpacity={1} onPress={handleClose} />

        <View style={styles.bottomSheet}>
          {/* 상단 핸들 */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* 월 네비게이터 */}
          <MonthNavigator
            year={currentYear}
            month={currentMonth + 1}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* 캘린더 그리드 */}
          <View style={styles.calendarContainer}>
            <CalendarGrid
              year={currentYear}
              month={currentMonth + 1}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              onSelectDate={handleSelectDate}
            />
          </View>

          {/* CTA 버튼 */}
          <View style={styles.ctaContainer}>
            <View style={styles.gradientDivider} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, !selectedDate && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={!selectedDate}
              >
                <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 선택된 날짜 미리보기 (디버깅용, 필요시 제거) */}
          {selectedDate && (
            <View style={styles.selectedDatePreview}>
              <Text style={styles.selectedDateText}>선택된 날짜: {formatDateToString(selectedDate)}</Text>
            </View>
          )}

          {/* Home Indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 26,
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: colors.grey100,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.grey800,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ctaContainer: {
    marginTop: 14,
  },
  gradientDivider: {
    height: 36,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  confirmButton: {
    backgroundColor: colors.blue500,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedDatePreview: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 14,
    color: colors.grey600,
  },
  homeIndicator: {
    height: 18,
    marginTop: 8,
  },
});
