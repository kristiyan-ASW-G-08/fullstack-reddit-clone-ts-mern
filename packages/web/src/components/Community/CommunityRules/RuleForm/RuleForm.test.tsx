import React from 'react';
import Modal from 'components/Modal/Modal';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import RuleForm from './RuleForm';
describe('<RuleForm />', () => {
  const nameValue = 'testValue';
  const descriptionValue = 'testDescription';
  const cancelHandler = jest.fn();
  const addRuleHandler = jest.fn();
  const editRuleHandler = jest.fn();
  const type = 'Add';
  const editRule = {
    name: 'Edit',
    description: 'Rule',
    scope: 'Posts Only',
    date: 'date',
    community: 'communityId',
    user: 'userId',
    _id: 'testId',
  };
  const { container, getByTestId, getByText, getByPlaceholderText } = render(
    <RuleForm
      cancelHandler={cancelHandler}
      editRule={editRule}
      addRuleHandler={addRuleHandler}
      editRuleHandler={editRuleHandler}
      type={type}
    />,
  );
  beforeEach(async () => {
    console.log(container);
    const nameInput = await waitForElement(() => getByPlaceholderText('Name'));
    fireEvent.change(nameInput, { target: { value: nameValue } });
    const descriptionInput = await waitForElement(() =>
      getByPlaceholderText('Description'),
    );
    fireEvent.change(descriptionInput, { target: { value: descriptionValue } });
    const scopeButton = getByText('Posts only');
    fireEvent.click(scopeButton);
    const submitButton = getByText('Add Rule');
    fireEvent.click(submitButton);
  });
  afterEach(cleanup);

  it('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
  it('should call addRuleHandler once', async () => {
    expect(addRuleHandler).toHaveBeenCalledTimes(1);
  });
});
