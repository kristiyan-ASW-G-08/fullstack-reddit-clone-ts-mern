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
import RootStoreContext from 'stores/RootStore/RootStore';
interface CommunityFormProps extends FormComponentProps {
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const { Item } = Form;
const { TextArea } = Input;
const CommunityForm: FC<CommunityFormProps> = ({ form, setConfirmLoading }) => {
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
        const { token } = authStore.authState;
        const request = await axios.post(
          'http://localhost:8080/communities',
          values,
          {
            headers: { Authorization: 'bearer ' + token },
          },
        );
        setConfirmLoading(false);
        if (request.status === 200) {
          const { data } = request.data;
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
    <Form onSubmit={submitHandler}>
      <Item>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: 'Enter community name!',
              min: 4,
              max: 40,
              type: 'string',
            },
          ],
        })(<Input placeholder="Name" type="text" />)}
      </Item>
      <Item>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Enter community description!',
              type: 'string',
              min: 20,
              max: 100,
            },
          ],
        })(<TextArea rows={5} placeholder="Description" />)}
      </Item>

      <Item>
        <Button type="primary" htmlType="submit" block>
          Create New Community
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedCommunityForm = Form.create({ name: 'communityForm' })(
  CommunityForm,
);

export default WrappedCommunityForm;
