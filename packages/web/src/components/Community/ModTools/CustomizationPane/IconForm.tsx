import React, {
  FC,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useState,
} from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import ValidationError from '@rddt/common/types/ValidationError';
import Community from '@rddt/common/types/Community';
import styles from './form.module.scss';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import { Form, Icon, Button, Tabs, Upload } from 'antd';
const { Dragger } = Upload;
interface IconFormProps extends FormComponentProps {
  community: Community;
}
const { Item } = Form;
const IconForm: FC<IconFormProps> = ({ form, community }) => {
  const { modalStore, authStore } = useContext(RootStoreContext);
  const { token } = authStore.authState;
  const [image, setImage] = useState();
  const resetHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    setImage(null);
    form.resetFields();
  };
  const changeIconHandler = async (formData: FormData) => {
    try {
      console.log(formData, 'Axios');
      const request = await axios.patch(
        `http://localhost:8080/communities/${community._id}/themes/icons`,
        formData,
        {
          headers: {
            Authorization: 'bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  };
  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values: any) => {
      try {
        const formData = new FormData();
        formData.append('image', image);
        changeIconHandler(formData);
      } catch (err) {
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
    <Form onSubmit={submitHandler} className={styles.form}>
      <Item>
        <div className="dropbox">
          {getFieldDecorator('image', {
            valuePropName: 'image',
          })(
            <Dragger
              name="image"
              action="#"
              beforeUpload={file => {
                setImage(file);
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Dragger>,
          )}
        </div>
      </Item>

      <Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedIconForm = Form.create<IconFormProps>({ name: 'Icon' })(IconForm);

export default WrappedIconForm;
