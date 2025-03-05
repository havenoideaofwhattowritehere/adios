import { PHONE_REGEX } from '../../constants/phone-regex';

export class PhoneValidation {
  isValidPhoneNumber(phone: string): boolean {
    return PHONE_REGEX.test(phone);
  }
  formatPhoneNumber(phone: string): string {
    const formatedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    return this.isValidPhoneNumber(formatedPhone) ? formatedPhone : null;
  }
}
