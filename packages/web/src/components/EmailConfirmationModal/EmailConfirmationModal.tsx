import React, { FC } from 'react';
import Modal from '../Modal/Modal';
import { Typography, Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import EmailConfirmation from './EmailConfirmation';
const { Title } = Typography;
interface MatchParams {
  token: string;
}
const EmailConfirmationModal: FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  console.log(match.params.token);
  const cancelHandler = () => {
    history.replace('/');
  };
  const { token } = match.params;
  return (
    <Modal title={'Email Confirmation'} cancelHandler={cancelHandler}>
      <EmailConfirmation closeModalHandler={cancelHandler} token={token} />
    </Modal>
  );
};

export default withRouter(EmailConfirmationModal);
