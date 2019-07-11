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
import openNotification from 'utilities/openNotification';
import RootStoreContext from 'stores/RootStore/RootStore';
import Community from '@rddt/common/types/Community';
import { SketchPicker } from 'react-color';
interface ColorsFormProps extends FormComponentProps {
  community: Community;
}
const { Item } = Form;
const ColorsForm: FC<ColorsFormProps> = ({ form, community }) => {
  const [base, setBase] = useState<string>(community.theme.colors.base);
  const [highlight, setHighlight] = useState<string>(
    community.theme.colors.highlight,
  );
  const { modalStore, authStore } = useContext(RootStoreContext);
  const { token } = authStore.authState;
  const resetHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    setBase(community.theme.colors.base);
    setHighlight(community.theme.colors.highlight);
  };
  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const colors = {
        base,
        highlight,
      };
      const request = await axios.patch(
        `http://localhost:8080/communities/${community._id}/themes/colors`,
        colors,
        {
          headers: { Authorization: 'bearer ' + token },
        },
      );
      openNotification(
        'success',
        'You have changed the community theme successfully!',
      );
    } catch (err) {
      if (err.response.data.data) {
        const { data } = err.response.data;
        console.log(data);
      }
    }
  };
  return (
    <Form
      onSubmit={submitHandler}
      style={{
        display: 'flex',
        width: '100vw',
        alignItems: 'center',
        flexFlow: 'column',
      }}
    >
      <Item label={<span>Base</span>}>
        {' '}
        <SketchPicker
          color={base}
          onChangeComplete={e => {
            setBase(e.hex);
          }}
        />
      </Item>
      <Item label={<span>Highlight</span>}>
        {' '}
        <SketchPicker
          color={highlight}
          onChangeComplete={e => {
            setHighlight(e.hex);
          }}
        />
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

const WrappedColorsForm = Form.create<ColorsFormProps>({ name: 'colorsForm' })(
  ColorsForm,
);

export default WrappedColorsForm;
