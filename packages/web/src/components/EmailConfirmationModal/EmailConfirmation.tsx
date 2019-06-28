import React, { FC, Dispatch, SetStateAction } from 'react';
import { Typography, Button } from 'antd';
import axios from 'axios';
import openNotification from '../../utilities/openNotification';
const { Title } = Typography;
interface EmailConfirmationProps {
  setConfirmLoading?: Dispatch<SetStateAction<boolean>>;
  closeModalHandler: () => void;
  token: string;
}
const EmailConfirmationModal: FC<EmailConfirmationProps> = ({
  setConfirmLoading,
  closeModalHandler,
  token,
}) => {
  const emailConfirmationHandler = async () => {
    try {
      const request = await axios.patch(`http://localhost:8080/users/${token}`);

      if (request.status === 204) {
        const title = 'Successful verification';
        const description = 'You have verified your email successfully';
        openNotification('success', title, description);
        closeModalHandler();
      }
    } catch (err) {
      if (err.response.data.data) {
        console.log(err.response.data.data);
      }
    }
  };
  return (
    <div>
      {' '}
      <Title level={4}>Confirm your email.</Title>
      <Button onClick={emailConfirmationHandler} type="primary">
        Confirm
      </Button>
    </div>
  );
};

export default EmailConfirmationModal;
