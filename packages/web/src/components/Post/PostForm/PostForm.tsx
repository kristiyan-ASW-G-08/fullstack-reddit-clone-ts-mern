import React, {
  FC,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import ValidationError from '@rddt/common/types/ValidationError';
import PopulatedPost from '@rddt/common/types/PopulatedPost';
import PostFormValues from 'types/PostFormValues';
import { Form, Icon, Input, Button, Tabs, Select, Upload } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
const { Dragger } = Upload;
const { TextArea } = Input;
interface WrappedPostFormProps extends FormComponentProps {
  cancelHandler: () => void;
  addPostHandler: (values: PostFormValues) => Promise<void>;
  addImagePostHandler: (formData: FormData) => Promise<void>;
  editPostHandler: (values: PostFormValues) => Promise<void>;
  type: 'Add' | 'Edit';
  editPost: PopulatedPost | undefined;
}
interface PostFormProps extends WrappedPostFormProps {
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const { Item } = Form;
const PostForm: FC<PostFormProps> = ({
  form,
  setConfirmLoading,
  cancelHandler,
  addPostHandler,
  addImagePostHandler,
  editPostHandler,
  type,
  editPost,
}) => {
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
  const [image, setImage] = useState();
  const resetHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    setImage(null);
    form.resetFields();
  };
  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values: any) => {
      try {
        const { title, text, linkUrl } = values;
        const postValues: PostFormValues = { type: postType, title };
        if (postType === 'text') {
          postValues['text'] = text;
        } else if (postType === 'link') {
          postValues['linkUrl'] = linkUrl;
        }
        setConfirmLoading(true);
        if (type === 'Add') {
          console.log(postValues);
          if (postType !== 'image') {
            addPostHandler(postValues);
          } else {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('type', postType);
            if (image) {
              console.log(image);
              formData.append('image', image);
            }
            addImagePostHandler(formData);
          }
        } else if (type === 'Edit' && editPost) {
          editPostHandler(postValues);
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
        {getFieldDecorator('title', {
          initialValue: editPost && type === 'Edit' ? editPost.title : '',
          rules: [
            {
              required: true,
              message: 'Enter post title!',
              min: 4,
              max: 100,
              type: 'string',
            },
          ],
        })(<Input placeholder="Title" />)}
      </Item>
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ textAlign: 'center' }}
        onChange={(e: string) => {
          let type: 'text' | 'image' | 'link' = 'text';
          switch (e) {
            case '1':
              type = 'text';
              break;
            case '2':
              type = 'link';
              break;
            case '3':
              type = 'image';
              break;
            default:
              type = 'text';
              break;
          }
          setPostType(type);
        }}
      >
        <TabPane tab="Text" key="1">
          <Item>
            {getFieldDecorator('text', {
              initialValue: editPost && type === 'Edit' ? editPost.text : '',
              rules: [
                {
                  required: true,
                  message: 'Enter post content!',
                  min: 4,
                  max: 10000,
                  type: 'string',
                },
              ],
            })(<TextArea rows={5} placeholder="Content" />)}
          </Item>
        </TabPane>
        <TabPane tab="Link" key="2">
          <Item>
            {getFieldDecorator('linkUrl', {
              initialValue: editPost && type === 'Edit' ? editPost.linkUrl : '',
              rules: [
                {
                  required: true,
                  message: 'Enter post link!',
                  min: 3,
                  max: 2100,
                  type: 'url',
                },
              ],
            })(<Input placeholder="Link" />)}
          </Item>
        </TabPane>
        <TabPane tab="Image" key="3">
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
        </TabPane>
      </Tabs>

      <Item>
        <Button type="primary" htmlType="submit" block>
          {type} Post
        </Button>
        <Button htmlType="submit" onClick={resetHandler} block type="danger">
          Reset
        </Button>
      </Item>
    </Form>
  );
};

const WrappedPostForm = Form.create<WrappedPostFormProps>({ name: 'postForm' })(
  PostForm,
);

export default WrappedPostForm;
