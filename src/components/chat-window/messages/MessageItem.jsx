import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { auth } from '../../../misc/firebase';

import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ messages, handleAdmin }) => {
  const { author, createdAt, text } = messages;

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />

        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />

        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAdmin
                ? 'Remove admin permission'
                : 'give admin permission in this room'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>

      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
