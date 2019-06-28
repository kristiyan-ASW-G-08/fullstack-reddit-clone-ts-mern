import { notification } from 'antd';
const openNotification = (
  type: 'success' | 'info' | 'warning' | 'error' | '',
  title: string,
  description: string,
) => {
  //@ts-ignore
  notification[type]({
    message: title,
    description,
    duration: 3,
  });
};
export default openNotification;
