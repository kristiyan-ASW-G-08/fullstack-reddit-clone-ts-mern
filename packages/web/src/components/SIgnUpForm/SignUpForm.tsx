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
interface SignUpFormProps extends FormComponentProps {
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const { Item } = Form;
const SignUpForm: FC<SignUpFormProps> = ({ form, setConfirmLoading }) => {
  const [currentPassword, setCurrentPassword] = useState<string>();
  const { modalStore } = useContext(RootStoreContext);
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
        const request = await axios.post('http://localhost:8080/users', values);
        setConfirmLoading(false);
        if (request.status === 204) {
          const title = 'Successful registration';
          const description = 'Verify your email to login.';
          openNotification('success', title, description);
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
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Please input your username!',
              min: 4,
              type: 'string',
            },
          ],
        })(
          <Input
            prefix={<Icon type="user" style={inputStyle} />}
            placeholder="Username"
          />,
        )}
      </Item>
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
            onChange={e => {
              setCurrentPassword(e.target.value);
            }}
          />,
        )}
      </Item>
      <Item>
        {getFieldDecorator('matchPassword', {
          rules: [
            {
              required: true,
              message: 'Please input your Password!',
              type: 'string',
              validator: (rule, value, callback: any) => {
                if (value !== currentPassword) {
                  form.setFields({
                    matchPassword: {
                      value: value,
                      errors: [new Error('Passwords do not match!')],
                    },
                  });
                  callback();
                } else {
                  callback();
                }
              },
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
          Sign Up
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedSignUpForm = Form.create({ name: 'signUpForm' })(SignUpForm);

export default WrappedSignUpForm;
