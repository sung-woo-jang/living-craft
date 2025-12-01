import { Card } from '@shared/ui';
import { CalendarBottomSheet } from '@shared/ui/calendar-bottom-sheet';
import { formatDateToString, parseStringToDate } from '@shared/ui/calendar-bottom-sheet/utils';
import { colors } from '@toss/tds-colors';
import { useReservationStore } from '@widgets/reservation';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');

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

        {selectedDate && (
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
});
