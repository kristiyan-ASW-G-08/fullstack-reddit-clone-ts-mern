import React, { FC, Dispatch, SetStateAction, SyntheticEvent } from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import ValidationError from '@rddt/common/types/ValidationError';
import Rule from '@rddt/common/types/Rule';
import RuleFormValues from 'types/RuleFormValues';
import { Form, Icon, Input, Button, Radio } from 'antd';
const { TextArea } = Input;
const { Group } = Radio;
interface WrappedRuleFormProps extends FormComponentProps {
  cancelHandler: () => void;
  addRuleHandler: (values: RuleFormValues) => Promise<void>;
  editRuleHandler: (values: RuleFormValues) => Promise<void>;
  type: 'Add' | 'Edit';
  editRule: Rule | undefined;
}
interface RuleFormProps extends WrappedRuleFormProps {
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const { Item } = Form;
const RuleForm: FC<RuleFormProps> = ({
  form,
  setConfirmLoading,
  cancelHandler,
  addRuleHandler,
  editRuleHandler,
  type,
  editRule,
}) => {
  const resetHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.resetFields();
  };
  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values: any) => {
      try {
        setConfirmLoading(true);
        if (type === 'Add') {
          addRuleHandler(values);
        } else if (type === 'Edit' && editRule) {
          editRuleHandler(values);
        }
        setConfirmLoading(false);
        form.resetFields();
        cancelHandler();
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
          initialValue: editRule && type === 'Edit' ? editRule.name : '',
          rules: [
            {
              required: true,
              message: 'Enter rule name!',
              min: 4,
              type: 'string',
            },
          ],
        })(<Input placeholder="Name" />)}
      </Item>
      <Item>
        {getFieldDecorator('description', {
          initialValue: editRule && type === 'Edit' ? editRule.description : '',
          rules: [
            {
              required: true,
              message: 'Enter rule description!',
              min: 4,
              type: 'string',
            },
          ],
        })(<TextArea rows={5} placeholder="Description" />)}
      </Item>
      <Item>
        {getFieldDecorator('scope', {
          initialValue: editRule && type === 'Edit' ? editRule.scope : '',
          rules: [
            {
              required: true,
              message: 'Enter rule description!',
              min: 4,
              type: 'string',
            },
          ],
        })(
          <Group>
            <Radio value={'Posts & comments'}>Posts and comments</Radio>
            <Radio value={'Posts only'}>Posts only</Radio>
            <Radio value={'Comments only'}>Comments only</Radio>
          </Group>,
        )}
      </Item>
      <Item>
        <Button type="primary" htmlType="submit" block>
          {type} Rule
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedRuleForm = Form.create<WrappedRuleFormProps>({ name: 'ruleForm' })(
  RuleForm,
);

export default WrappedRuleForm;
