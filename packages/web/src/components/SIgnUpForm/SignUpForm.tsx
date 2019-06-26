import React, { FC, SyntheticEvent } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import axios from 'axios';
const SignUpForm: FC<FormComponentProps> = ({ form }) => {
  const inputStyle = { color: 'rgba(0,0,0,.25)' };
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      console.log(values);
      try {
        const request = await axios.post('http://localhost:8080/users', values);
        console.log(request);
      } catch (err) {
        console.log(err.data);
      }
    });
  };
  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Please input your username!',
              min: 4,
            },
          ],
        })(
          <Input
            prefix={<Icon type="user" style={inputStyle} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            { required: true, message: 'Please input your email!', min: 4 },
          ],
        })(
          <Input
            prefix={<Icon type="mail" style={inputStyle} />}
            placeholder="Email"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input.Password
            prefix={<Icon type="lock" style={inputStyle} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('matchPassword', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input.Password
            prefix={<Icon type="lock" style={inputStyle} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedSignUpForm = Form.create({ name: 'signUpForm' })(SignUpForm);

export default WrappedSignUpForm;
