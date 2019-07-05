import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBarOption from './SearchBarOption';
describe('<SearchBarOption/>', () => {
  const community = {
    data: {
      name: 'testName',
      subscribers: 1000,
      score: 1,
      _id: 'testId',
      theme: {
        icon: 'test.svg',
        colors: {
          base: 'baseColor',
          highlight: 'highlightColor',
        },
      },
    },
    links: {
      self: 'testLink',
    },
  };
  const { container, getByText, getByAltText } = render(
    <SearchBarOption community={community} />,
    { wrapper: BrowserRouter },
  );
  const { name, subscribers } = community.data;
  const { icon } = community.data.theme;
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
