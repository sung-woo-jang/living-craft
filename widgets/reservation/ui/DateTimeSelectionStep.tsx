import { useAvailableTimes } from '@shared/hooks/useServices';
import { Card } from '@shared/ui';
import { CalendarBottomSheet } from '@shared/ui/calendar-bottom-sheet';
import { formatDateToString, parseStringToDate } from '@shared/ui/calendar-bottom-sheet/utils';
import { colors } from '@toss/tds-colors';
import { Skeleton } from '@toss/tds-react-native';
import { useFormContext } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useReservationStore } from '../store';
import { ReservationFormData } from '../types';

export function DateTimeSelectionStep() {
  const { watch, setValue } = useFormContext<ReservationFormData>();
  const {
    // 견적 캘린더
    isEstimateCalendarVisible,
    openEstimateCalendar,
    closeEstimateCalendar,
    // 시공 캘린더
    isConstructionCalendarVisible,
    openConstructionCalendar,
    closeConstructionCalendar,
  } = useReservationStore([
    'isEstimateCalendarVisible',
    'openEstimateCalendar',
    'closeEstimateCalendar',
    'isConstructionCalendarVisible',
    'openConstructionCalendar',
    'closeConstructionCalendar',
  ]);

  const selectedService = watch('service');
  // 견적 날짜/시간
  const estimateDate = watch('estimateDate');
  const estimateTimeSlot = watch('estimateTimeSlot');
  // 시공 날짜/시간
  const constructionDate = watch('constructionDate');
  const constructionTimeSlot = watch('constructionTimeSlot');

  // API로 예약 가능 시간 조회
  const { data: estimateTimesResponse, isLoading: isLoadingEstimateTimes } = useAvailableTimes(
    selectedService?.id ?? 0,
    estimateDate,
    'estimate',
    !!selectedService?.id && !!estimateDate
  );

  const { data: constructionTimesResponse, isLoading: isLoadingConstructionTimes } = useAvailableTimes(
    selectedService?.id ?? 0,
    constructionDate,
    'construction',
    !!selectedService?.id && !!constructionDate
  );

  // 시공 시간 선택이 필요한지 확인 (기본값: true)
  const requiresTimeSelection = selectedService?.requiresTimeSelection !== false;

  // 견적 일정이 완료되었는지 확인 (날짜 + 시간 선택 완료)
  const isEstimateComplete = estimateDate !== '' && estimateTimeSlot !== null;

  // 견적 날짜 선택 핸들러
  const handleEstimateDateConfirm = (date: Date) => {
    const dateString = formatDateToString(date);
    setValue('estimateDate', dateString);
    setValue('estimateTimeSlot', null);
    closeEstimateCalendar();
  };

  // 시공 날짜 선택 핸들러
  const handleConstructionDateConfirm = (date: Date) => {
    const dateString = formatDateToString(date);
    setValue('constructionDate', dateString);
    setValue('constructionTimeSlot', null);
    closeConstructionCalendar();
  };

  return (
    <>
      <ScrollView style={styles.stepContent} contentContainerStyle={styles.scrollContent}>
        {/* 견적 희망 날짜/시간 섹션 */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>견적 희망 날짜/시간</Text>
            <Text style={styles.sectionSubtitle}>견적을 받고 싶은 날짜와 시간을 선택해주세요</Text>
          </View>

          {/* 견적 날짜 선택 */}
          <TouchableOpacity style={styles.dateInputButton} onPress={openEstimateCalendar}>
            <Text style={estimateDate ? styles.dateInputTextSelected : styles.dateInputText}>
              {estimateDate || '날짜를 선택해주세요'}
            </Text>
          </TouchableOpacity>

          {/* 견적 시간 선택 */}
          {estimateDate && (
            <View style={styles.timeSlotSection}>
              <Text style={styles.timeSlotLabel}>시간 선택</Text>
              {isLoadingEstimateTimes ? (
                <View style={styles.timeSlotGrid}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} width={72} height={44} />
                  ))}
                </View>
              ) : estimateTimesResponse?.isAvailable === false ? (
                <View style={styles.unavailableNotice}>
                  <Text style={styles.unavailableText}>예약이 불가능한 날짜입니다.</Text>
                </View>
              ) : (
                <View style={styles.timeSlotGrid}>
                  {estimateTimesResponse?.times?.map((slot) => (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.timeSlot,
                        estimateTimeSlot?.time === slot.time && styles.timeSlotSelected,
                        !slot.available && styles.timeSlotDisabled,
                      ]}
                      onPress={() => slot.available && setValue('estimateTimeSlot', slot)}
                      disabled={!slot.available}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          estimateTimeSlot?.time === slot.time && styles.timeSlotTextSelected,
                          !slot.available && styles.timeSlotTextDisabled,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>

        {/* 시공 희망 날짜/시간 섹션 (견적 일정 선택 완료 후 표시) */}
        {isEstimateComplete && (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>시공 희망 날짜/시간</Text>
            <Text style={styles.sectionSubtitle}>시공을 받고 싶은 날짜와 시간을 선택해주세요</Text>
          </View>

          {/* 시공 날짜 선택 */}
          <TouchableOpacity style={styles.dateInputButton} onPress={openConstructionCalendar}>
            <Text style={constructionDate ? styles.dateInputTextSelected : styles.dateInputText}>
              {constructionDate || '날짜를 선택해주세요'}
            </Text>
          </TouchableOpacity>

          {/* 시공 시간 선택 (requiresTimeSelection이 true인 경우에만) */}
          {constructionDate && requiresTimeSelection && (
            <View style={styles.timeSlotSection}>
              <Text style={styles.timeSlotLabel}>시간 선택</Text>
              {isLoadingConstructionTimes ? (
                <View style={styles.timeSlotGrid}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} width={72} height={44} />
                  ))}
                </View>
              ) : constructionTimesResponse?.isAvailable === false ? (
                <View style={styles.unavailableNotice}>
                  <Text style={styles.unavailableText}>예약이 불가능한 날짜입니다.</Text>
                </View>
              ) : (
                <View style={styles.timeSlotGrid}>
                  {constructionTimesResponse?.times?.map((slot) => (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.timeSlot,
                        constructionTimeSlot?.time === slot.time && styles.timeSlotSelected,
                        !slot.available && styles.timeSlotDisabled,
                      ]}
                      onPress={() => slot.available && setValue('constructionTimeSlot', slot)}
                      disabled={!slot.available}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          constructionTimeSlot?.time === slot.time && styles.timeSlotTextSelected,
                          !slot.available && styles.timeSlotTextDisabled,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 하루 종일 작업 안내 (requiresTimeSelection이 false인 경우) */}
          {constructionDate && !requiresTimeSelection && (
            <View style={styles.allDayNotice}>
              <Text style={styles.allDayIcon}>📅</Text>
              <View style={styles.allDayTextContainer}>
                <Text style={styles.allDayTitle}>하루 종일 작업</Text>
                <Text style={styles.allDayDescription}>
                  기본 오전 9시에 시공 예정입니다.{'\n'}세부 시간은 견적 방문 시 조정 가능합니다.
                </Text>
              </View>
            </View>
          )}
        </Card>
        )}
      </ScrollView>

      {/* 견적 캘린더 */}
      <CalendarBottomSheet
        visible={isEstimateCalendarVisible}
        selectedDate={parseStringToDate(estimateDate)}
        title="견적 희망 날짜 선택"
        confirmButtonText="날짜 선택"
        onConfirm={handleEstimateDateConfirm}
        onClose={closeEstimateCalendar}
      />

      {/* 시공 캘린더 */}
      <CalendarBottomSheet
        visible={isConstructionCalendarVisible}
        selectedDate={parseStringToDate(constructionDate)}
        title="시공 희망 날짜 선택"
        confirmButtonText="날짜 선택"
        onConfirm={handleConstructionDateConfirm}
        onClose={closeConstructionCalendar}
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
  sectionSubtitle: {
    fontSize: 14,
    color: colors.grey600,
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
  timeSlotSection: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  timeSlotLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey700,
    marginBottom: 8,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  unavailableNotice: {
    backgroundColor: colors.grey100,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 14,
    color: colors.grey500,
  },
  allDayNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.blue50,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
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
