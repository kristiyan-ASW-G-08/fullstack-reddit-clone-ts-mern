import React, {
  FC,
  SyntheticEvent,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import axios from 'axios';
import ValidationError from '@rddt/common/types/ValidationError';
import RootStoreContext from '../../stores/RootStore/RootStore';
import openNotification from '../../utilities/openNotification';
interface LoginFormProps extends FormComponentProps {
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const { Item } = Form;
const LoginForm: FC<LoginFormProps> = ({ form, setConfirmLoading }) => {
  const { modalStore, authStore } = useContext(RootStoreContext);
  const inputStyle = { color: 'rgba(0,0,0,.25)' };
  const resetHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.resetFields();
  };
  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      try {
        setConfirmLoading(true);
        const request = await axios.post(
          'http://localhost:8080/users/token',
          values,
        );
        setConfirmLoading(false);
        if (request.status === 200) {
          const { data } = request.data;
          console.log(data);
          data['isAuth'] = true;
          authStore.setAuthState(data);
          modalStore.resetModalState();
        }
      } catch (err) {
        setConfirmLoading(false);
        if (err.response.data.data) {
          const { data } = err.response.data;
          data.map((validationErr: ValidationError) => {
            form.setFields({
              [validationErr.param]: {
                value: validationErr.value,
                errors: [new Error(validationErr.msg)],
              },
            });
          });
        }
      }
    });
  };
  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={submitHandler} className="login-form">
      <Item>
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please input your email!',
              min: 4,
              type: 'string',
            },
          ],
        })(
          <Input
            prefix={<Icon type="mail" style={inputStyle} />}
            placeholder="Email"
          />,
        )}
      </Item>
      <Item>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your Password!',
              type: 'string',
            },
          ],
        })(
          <Input.Password
            prefix={<Icon type="lock" style={inputStyle} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Item>

      <Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedLoginForm = Form.create({ name: 'loginForm' })(LoginForm);

export default WrappedLoginForm;
