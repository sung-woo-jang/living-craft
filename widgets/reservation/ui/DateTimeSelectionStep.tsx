import { Card } from '@shared/ui';
import { CalendarBottomSheet } from '@shared/ui/calendar-bottom-sheet';
import { formatDateToString, parseStringToDate } from '@shared/ui/calendar-bottom-sheet/utils';
import { colors } from '@toss/tds-colors';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useReservationStore } from '../store/reservationStore';
import { ReservationFormData } from '../types';

export function DateTimeSelectionStep() {
  const { watch, setValue } = useFormContext<ReservationFormData>();
  const { timeSlots, disabledDates, isCalendarVisible, openCalendar, closeCalendar, updateTimeSlotsForDate } =
    useReservationStore([
      'timeSlots',
      'disabledDates',
      'isCalendarVisible',
      'openCalendar',
      'closeCalendar',
      'updateTimeSlotsForDate',
    ]);

  const selectedService = watch('service');
  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');

  // 시간 선택이 필요한지 확인 (기본값: true)
  const requiresTimeSelection = selectedService?.requiresTimeSelection !== false;

  const handleDateConfirm = (date: Date) => {
    const dateString = formatDateToString(date);
    setValue('date', dateString);
    setValue('timeSlot', null);
    updateTimeSlotsForDate(dateString);
    closeCalendar();
  };

  return (
    <>
      <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>날짜 선택</Text>
          </View>
          <TouchableOpacity style={styles.dateInputButton} onPress={openCalendar}>
            <Text style={selectedDate ? styles.dateInputTextSelected : styles.dateInputText}>
              {selectedDate || '날짜를 선택해주세요'}
            </Text>
          </TouchableOpacity>
        </Card>

        {selectedDate && requiresTimeSelection && (
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>시간 선택</Text>
            </View>
            <View style={styles.timeSlotGrid}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    selectedTimeSlot?.id === slot.id && styles.timeSlotSelected,
                    !slot.available && styles.timeSlotDisabled,
                  ]}
                  onPress={() => slot.available && setValue('timeSlot', slot)}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTimeSlot?.id === slot.id && styles.timeSlotTextSelected,
                      !slot.available && styles.timeSlotTextDisabled,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {selectedDate && !requiresTimeSelection && (
          <Card>
            <View style={styles.allDayNotice}>
              <Text style={styles.allDayIcon}>📅</Text>
              <View style={styles.allDayTextContainer}>
                <Text style={styles.allDayTitle}>하루 종일 작업</Text>
                <Text style={styles.allDayDescription}>
                  이 서비스는 하루 종일 진행되므로 별도의 시간 선택이 필요하지 않습니다.
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      <CalendarBottomSheet
        visible={isCalendarVisible}
        selectedDate={parseStringToDate(selectedDate)}
        disabledDates={disabledDates}
        title="예약 날짜 선택"
        confirmButtonText="날짜 선택"
        onConfirm={handleDateConfirm}
        onClose={closeCalendar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 4,
  },
  dateInputButton: {
    backgroundColor: colors.grey50,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  dateInputText: {
    fontSize: 15,
    color: colors.grey400,
  },
  dateInputTextSelected: {
    fontSize: 15,
    color: colors.grey900,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  timeSlot: {
    minWidth: 72,
    backgroundColor: colors.grey50,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.blue500,
  },
  timeSlotDisabled: {
    backgroundColor: colors.grey100,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.grey900,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: colors.white,
  },
  timeSlotTextDisabled: {
    color: colors.grey400,
  },
  allDayNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  allDayIcon: {
    fontSize: 32,
  },
  allDayTextContainer: {
    flex: 1,
  },
  allDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 4,
  },
  allDayDescription: {
    fontSize: 14,
    color: colors.grey600,
    lineHeight: 20,
  },
});
