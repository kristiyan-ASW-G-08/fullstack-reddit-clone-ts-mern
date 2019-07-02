import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import CommunityDetails from './CommunityDetails';
describe('<CommunityDetails/>', () => {
  const community = {
    name: 'testName',
    subscribers: 1000,
    _id: 'testId',
    user: 'testUser',
    date: 'testDate',
    description: 'testDescription',
    theme: {
      icon: 'test.svg',
      colors: {
        base: 'baseColor',
        highlight: 'highlightColor',
      },
    },
  };
  const { container, getByText, getByAltText } = render(
    <CommunityDetails community={community} />,
  );
  const { name, subscribers } = community;
  const { icon } = community.theme;
  it('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
  it(`should exist`, async () => {
    const element = getByText(name);
    expect(element).toBeTruthy();
  });
  it(`should exist`, async () => {
    const element = getByText(`${subscribers} members`);
    expect(element).toBeTruthy();
  });
  it('should exist', async () => {
    const element = getByAltText(`${name} icon`) as HTMLImageElement;
    expect(element).toBeTruthy();
    expect(element.src).toMatch(`http://localhost:8080/images/${icon}`);
  });
});
