import { toast } from 'react-toastify';

const notifySettings = [
  {
    actions: ['CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'ACCEPT', 'REJECT', 'CANCEL', 'ADD', 'CHANGE_PASSWORD'],
    status: 'SUCCESS',
    type: 'success',
    message: 'Thành công',
  },
  {
    actions: ['CREATE', 'UPDATE', 'DELETE', 'DOWNLOAD', 'ACCEPT', 'REJECT', 'CANCEL', 'ADD', 'CHANGE_PASSWORD'],
    status: 'FAILURE',
    type: 'error',
    message: 'Thất bại',
  },
];

const notifyMiddleware = () => (next) => (action) => {
  if (action?.type && (typeof action?.message === 'undefined' || action?.message)) {
    const notifySetting = notifySettings.find((s) =>
      s.actions.find((a) => action.type.includes(a)) && action.type.includes(s.status),
    );

    if (notifySetting) {
      toast(action?.message ?? notifySetting.message, { type: notifySetting.type });
    }
  }

  next(action);
};

export default notifyMiddleware;
