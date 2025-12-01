import { TimeSlot } from '@shared/constants';
import { HomeService } from '@shared/constants/home-services';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  requirements: string;
}

export interface ReservationFormData {
  service: HomeService | null;
  date: string;
  timeSlot: TimeSlot | null;
  customerInfo: CustomerInfo;
  agreedToTerms: boolean;
}

export type StepKey = 'service' | 'datetime' | 'customer' | 'confirmation';

export const STEP_ORDER: StepKey[] = ['service', 'datetime', 'customer', 'confirmation'];

export const DEFAULT_FORM_VALUES: ReservationFormData = {
  service: null,
  date: '',
  timeSlot: null,
  customerInfo: {
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    requirements: '',
  },
  agreedToTerms: false,
};
