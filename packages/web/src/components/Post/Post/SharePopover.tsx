import React, { FC } from 'react';
import { Popover, Icon } from 'antd';
import openNotification from 'utilities/openNotification';
interface SharePopoverProps {
  title: string;
  postId: string;
}
const SharePopover: FC<SharePopoverProps> = ({ title, postId }) => {
  const postUrl = `http://localhost:3000/posts/${postId}`;
  const clipboardCopyHandler = () => {
    navigator.clipboard.writeText(postUrl).then(writeData => {
      openNotification('info', 'Link  copied to clipboard');
    });
  };

  const content = (
    <div>
      <a
        style={{ display: 'block' }}
        href={`https://twitter.com/intent/tweet?text=${title}&url=${postUrl}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        Twitter
      </a>
      <a
        style={{ display: 'block' }}
        href={`https://www.reddit.com/submit?url=${postUrl}&title=${title}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        Reddit
      </a>
      <p style={{ cursor: 'pointer' }} onClick={clipboardCopyHandler}>
        Copy Link
      </p>
    </div>
  );
  return (
    <Popover placement="bottom" content={content} title="Share">
      <Icon type="share-alt" />
    </Popover>
  );
};
export default SharePopover;
