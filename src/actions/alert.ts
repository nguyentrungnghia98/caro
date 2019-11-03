import { OPEN_ALERT, CLOSE_ALERT } from './types';
import { ActionAlert, Action } from '.';

export interface DataAlert {
  type: 'success' | 'warning' | 'info' | 'error' | 'question' | string;
  title?: string;
  subtitle?: string;
  okText?: string;
  confirmText?: string;
  cancelText?: string;
  onYesFn?: any;
}

export const openAlertSuccess = (
  title: string,
  subtitle: string,
  okText = ''
): ActionAlert => {
  const data = { type: 'success', title, subtitle, okText };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertInfo = (
  title: string,
  subtitle: string,
  okText = ''
): ActionAlert => {
  const data = { type: 'info', title, subtitle, okText };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertError = (
  title: string,
  subtitle: string,
  okText = ''
): ActionAlert => {
  const data = { type: 'error', title, subtitle, okText };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertWarning = (
  title: string,
  subtitle: string,
  confirmText = '',
  onYesFn = (): void => {},
  cancelText = '',
  confirmFn = null
): ActionAlert => {
  const data = {
    type: 'warning',
    title,
    subtitle,
    confirmText,
    cancelText,
    confirmFn,
    onYesFn
  };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertQuestion = (
  title: string,
  subtitle: string,
  confirmText = '',
  onYesFn = (): void => {},
  cancelText = '',
  confirmFn = null
): ActionAlert => {
  const data = {
    type: 'question',
    title,
    subtitle,
    confirmText,
    cancelText,
    confirmFn,
    onYesFn
  };
  return {
    type: OPEN_ALERT,
    data
  };
};

// export const show = async (
//   title: string,
//   subtitle: string,
//   confirmText = '',
//   onYesFn = (): void => {},
//   cancelText = '',
//   confirmFn = null
// ): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     this.promiseInfo = {
//       resolve,
//       reject
//     };
//     this.setState({
//       show: true
//     });
//   });
// };

export const closeAlert = (): Action => {
  return {
    type: CLOSE_ALERT
  };
};
