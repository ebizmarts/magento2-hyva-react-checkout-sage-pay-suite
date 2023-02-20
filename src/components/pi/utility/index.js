import { __ } from '../../../../../../i18n';
import { PAYMENT_METHOD_FORM } from '../../../../../../config';

export const piWithoutDropinField = `${PAYMENT_METHOD_FORM}.sagepaysuitepi`;
export const cardHolderNameField = `${piWithoutDropinField}.cardHolderName`;
export const cardNumberField = `${piWithoutDropinField}.cardNumber`;
export const cardExpirationDateField = `${piWithoutDropinField}.cardExpirationDate`;
export const cardsSecurityCodeField = `${piWithoutDropinField}.cardsSecurityCode`;

export function isEmptyAnyField(sagePaySuiteFormValues) {
  return (
    sagePaySuiteFormValues.cardHolderNameField.trim() === '' ||
    sagePaySuiteFormValues.cardNumberField.trim() === '' ||
    sagePaySuiteFormValues.cardsSecurityCodeField.trim() === '' ||
    sagePaySuiteFormValues.cardExpirationDateField.trim() === ''
  );
}

export function isLengthFour(expirationDate) {
  return expirationDate.length === 4;
}

export function getCurrentMonth() {
  let currentMonth = (new Date().getMonth() + 1).toString();
  if (currentMonth.length === 1) {
    currentMonth = currentMonth.padStart(2, '0');
  }
  return currentMonth;
}

export function getCurrentYear() {
  return new Date().getFullYear().toString().substring(2, 4);
}

export function isValidMonthYear(expirationDate) {
  let isValidMonth = false;
  let isValidYear = false;
  const expirationYear = expirationDate.substring(2, 4);
  const expirationMonth = expirationDate.substring(0, 2);
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();
  if (expirationYear >= currentYear) {
    if (expirationYear === currentYear) {
      if (expirationMonth >= currentMonth) {
        isValidMonth = true;
      }
    } else {
      isValidMonth = true;
    }
    isValidYear = true;
  }

  return isValidMonth && isValidYear;
}

export function isValidExpirationDate(expirationDate) {
  return isLengthFour(expirationDate) && isValidMonthYear(expirationDate);
}

export function isValidCardHolderName(cardHolder) {
  return cardHolder.length <= 45;
}

export function validate(values) {
  const sagePaySuiteFormValues = values.sagepaysuitepi;
  const expirationDate = sagePaySuiteFormValues.cardExpirationDateField;
  const cardHolder = sagePaySuiteFormValues.cardHolderNameField;
  if (isEmptyAnyField(sagePaySuiteFormValues)) {
    return {
      isValid: false,
      message: __('No field can be empty'),
    };
  }

  if (!isValidExpirationDate(expirationDate)) {
    return {
      isValid: false,
      message: __('Please enter a valid expiration date.'),
    };
  }

  if (!isValidCardHolderName(cardHolder)) {
    return {
      isValid: false,
      message: __('Please enter a valid card holder name.'),
    };
  }

  return { isValid: true };
}
